/**
 * Created by Oliner on 16/7/28.
 */

Beach.Land = function( gl )
{
    this.landGL = ( undefined !== gl ) ? ( gl ) : ( glUtil.newWebGL( document.getElementById( "beach" ) ) );

    this.vertexs    = [];
    this.uvs        = [];
    this.indices    = [];
    this.landTexture= [];

    this.initLandProgram();
    this.initLandBuffer();
    this.initLandTexture("../../res/sand.jpg", "../../res/grass.jpg" );
}

Beach.Land.prototype.initLandProgram = function()
{
    var vString = "precision mediump float;\
                    attribute vec3 aPosition;\
                    attribute vec2 aCoord;\
                    uniform mat4 uPMatrix;\
                    uniform mat4 uMVMatrix;\
                    varying vec2 vCoord;\
                    varying float vertexHeight;\
                    void main(){\
                        gl_Position = uPMatrix * uMVMatrix * vec4( aPosition, 1.0 );\
                        vCoord = aCoord;\
                        vertexHeight = aPosition.y;\
                    }";

    var fString = "precision mediump float;\
                    uniform sampler2D uSamplerLand;\
                    uniform sampler2D uSamplerGrass;\
                    varying vec2 vCoord;\
                    varying float vertexHeight;\
                    void main(){\
                        float h1 = 0.03;\
                        float h2 = 0.04;\
                        vec4 sand = texture2D( uSamplerLand, vec2( vCoord.s, vCoord.t ) );\
                        vec4 grass = texture2D( uSamplerGrass, vec2( vCoord.s, vCoord.t ) );\
                        if( vertexHeight < h1 )\
                        {\
                            gl_FragColor = sand;\
                        }\
                        else if( vertexHeight < h2 )\
                        {\
                            float radio = ( vertexHeight - h1 ) / ( h2 - h1 );\
                            sand *= ( 1.0 - radio );\
                            grass *= radio;\
                            gl_FragColor = sand + grass;\
                        }\
                        else\
                        {\
                            gl_FragColor = grass;\
                        }\
                    }";

    this.landProgram = glUtil.newProgramWithString( this.landGL, vString, fString );
    this.landProgram.uSamplerLand = this.landGL.getUniformLocation( this.landProgram, "uSamplerLand" );
    this.landProgram.uSamplerGrass = this.landGL.getUniformLocation( this.landProgram, "uSamplerGrass" );

}

Beach.Land.prototype.initLandBuffer = function()
{
    for( var i = 0; i <= Beach.LandWidth; ++i )
    {
        for( var j = 0; j <= Beach.LandHeight; ++j )
        {
            var x = -2.5 + ( Beach.LandHeightStep * i ) * 2.5;
            var z = 1 - ( Beach.LandHeightStep * j );
            var y;

            var ij = ( i + j );

            if( Beach.LandHeight >= ij )
            {
                y = Math.sin(ij / 50 * 0.05) ;
            }
            else
            {
                y = Math.sin(( 2 - ij / 50 ) * 0.05 );
            }

            this.vertexs.push( x );
            this.vertexs.push( y );
            this.vertexs.push( z );

            this.uvs.push( i / Beach.LandWidth * 10 );
            this.uvs.push( j / Beach.LandHeight );
        }
    }

    for( var m = 0; m < Beach.LandWidth; ++m )
    {
        for( var n = 0; n < Beach.LandHeight; ++n )
        {
            var first = ( m * ( Beach.LandHeight + 1 ) ) + n;
            var second = first + 1;
            var third = first + Beach.LandHeight + 1;

            this.indices.push( first );
            this.indices.push( second );
            this.indices.push( third );

            first = second;
            second = third;
            third = second + 1;

            this.indices.push( first );
            this.indices.push( second );
            this.indices.push( third );
        }
    }

}

Beach.Land.prototype.initLandTexture= function( landSrc, grassSrc )
{
    this.landTexture.land = glUtil.newTexture( this.landGL, landSrc );
    this.landTexture.grass = glUtil.newTexture( this.landGL, grassSrc );

}

Beach.Land.prototype.drawLand = function( pMatrix, mvMatrix )
{
    this.landGL.useProgram( this.landProgram );
    glUtil.updateMatrixUniforms( this.landGL, this.landProgram, pMatrix, mvMatrix );

    this.landGL.activeTexture( this.landGL.TEXTURE0 );
    this.landGL.bindTexture( this.landGL.TEXTURE_2D, this.landTexture.land );
    this.landGL.uniform1i( this.landProgram.uSamplerLand, 0 );

    this.landGL.activeTexture( this.landGL.TEXTURE1 );
    this.landGL.bindTexture( this.landGL.TEXTURE_2D, this.landTexture.grass );
    this.landGL.uniform1i( this.landProgram.uSamplerGrass, 1 );

    var renderInfo =
    {
        vertexs: this.vertexs,
        indices: this.indices,
        uvs: this.uvs,
    }

    this.drawLandBuffer = glUtil.updateInfo( this.landGL, this.landProgram, renderInfo );

    glUtil.render( this.landGL, this.drawLandBuffer );
}

Beach.Land.prototype.renderLand = function( pMatrix, mvMatrix )
{
    this.drawLand( pMatrix, mvMatrix );
}
/**
 * Created by Oliner on 16/7/30.
 */

Beach.Water = function( gl )
{
    this.waterGL = ( undefined !== gl ) ? ( gl ) : ( glUtil.newWebGL( document.getElementById( "beach" ) ) );

    this.vertexs = [];
    this.uvs = [];
    this.indices = [];
    this.drawWaterBuffer;

    this.initWaterProgram();
    this.initWaterBuffer();
    this.initWaterTexture("../../res/water.jpg");
}

Beach.Water.prototype.initWaterProgram = function()
{
    var vString = "precision mediump float;\
                    attribute vec3 aPosition;\
                    attribute vec2 aCoord;\
                    uniform mat4 uMVMatrix;\
                    uniform mat4 uPMatrix;\
                    uniform float uStartAngle;\
                    varying vec2 vCoord;\
                    void main( void )\
                    {\
                        float currAngleX = uStartAngle - ( aPosition.x + 1.0 ) * 3.1415926 ;\
                        float currAngleZ = ( aPosition.z + 1.0 ) * 3.1415926 * 0.75;\
                        float th = sin( currAngleZ - currAngleX ) * 0.005;\
                        gl_Position = uPMatrix * uMVMatrix * vec4( aPosition.x, aPosition.y + th, aPosition.z, 1.0 );\
                        vCoord = aCoord;\
                    }";

    var fString = "precision mediump float;\
                    varying vec2 vCoord;\
                    uniform sampler2D uSampler;\
                    void main( void )\
                    {\
                        gl_FragColor = texture2D( uSampler, vec2( vCoord.s, vCoord.t ) );\
                    }";

    this.waterProgram = glUtil.newProgramWithString( this.waterGL, vString, fString );
    this.waterProgram.uStartAngle = this.waterGL.getUniformLocation( this.waterProgram, "uStartAngle" );
    this.waterProgram.uSampler    = this.waterGL.getUniformLocation( this.waterProgram, "uSampler" );
}

Beach.Water.prototype.initWaterBuffer = function()
{
    var row = 9, col = 12;
    var offSizeRow = 2.0 / row, offSizeCol = 2.0 / col;

    var vertexs = [];
    var uvs = [];
    var indices = [];

    for( var i = 0; i <= row; ++i )
    {
        for( var j = 0; j<= col; ++j )
        {
            var x = -3 + ( j * offSizeCol ) * 3;
            var z = 1 - ( i * offSizeRow );
            var y = 0.025;


            var s = j / col;
            var t = i / row;

            this.vertexs.push( x );
            this.vertexs.push( y );
            this.vertexs.push( z );

            this.uvs.push( s );
            this.uvs.push( t );
        }
    }

    for( var i = 0; i < row; ++i )
    {
        for( var j = 0; j < col; ++j )
        {
            var first = ( i * ( col + 1 ) ) + j;
            var second = first + 1;
            var third = first + col + 1;

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

Beach.Water.prototype.initWaterTexture = function( src )
{
    this.texture = glUtil.newTexture( this.waterGL, src );
}

Beach.Water.prototype.drawWater = function( pMatrix, mvMatrix, angle )
{
    this.waterGL.useProgram( this.waterProgram );
    glUtil.updateMatrixUniforms( this.waterGL, this.waterProgram, pMatrix, mvMatrix );

    this.waterGL.activeTexture( this.waterGL.TEXTURE0 );
    this.waterGL.bindTexture( this.waterGL.TEXTURE_2D, this.texture );
    this.waterGL.uniform1i( this.waterProgram.uSampler, 0 );

    this.waterGL.uniform1f( this.waterProgram.uStartAngle, ( angle ) );

    var renderInfo =
    {
        vertexs: this.vertexs,
        uvs: this.uvs,
        indices: this.indices,
    };
    this.drawWaterBuffer = glUtil.updateInfo( this.waterGL, this.waterProgram, renderInfo );
    glUtil.render( this.waterGL, this.drawWaterBuffer );
}

Beach.Water.prototype.renderWater = function( pMatrix, mvMatrix, angle )
{
    this.drawWater( pMatrix, mvMatrix, angle );
}
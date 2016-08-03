/**
 * Created by Oliner on 16/7/30.
 */

Beach.TreeTrunk = function( gl )
{
    this.treeTrunkGL = ( undefined !== gl ) ? ( gl ) : ( glUtil.newWebGL( document.getElementById( "beach" ) ) );

    this.vertexs    = [];
    this.uvs        = [];
    this.indices    = [];

    this.initTreeTrunkProgram();
    this.initTreeTrunkBuffer();
    this.initTreeTrunkTexture("../../res/treetrunk.png");
}

Beach.TreeTrunk.prototype.initTreeTrunkProgram = function()
{
    // TODO: Z方向风吹
    var vString = "precision mediump float;\
                    attribute vec3 aPosition;\
                    attribute vec2 aCoord;\
                    uniform mat4 uPMatrix;\
                    uniform mat4 uMVMatrix;\
                    uniform float uWind;\
                    varying vec2 vCoord;\
                    void main(){\
                        float bendr = 1.0;\
                        float currRadius = aPosition.y;\
                        float resultHeight = aPosition.y * cos( uWind * 0.5 );\
                        float increase = bendr - bendr * cos( currRadius );\
                        float x = aPosition.x + increase * sin( uWind );\
                        gl_Position = uPMatrix * uMVMatrix * vec4( x, resultHeight, aPosition.z, 1.0 );\
                        vCoord = aCoord;\
                    }";

    var fString = "precision mediump float;\
                    uniform sampler2D uSamplerTreeTrunk;\
                    varying vec2 vCoord;\
                    void main(){\
                        gl_FragColor = texture2D( uSamplerTreeTrunk, vec2( vCoord.s, vCoord.t ) );\
                    }";

    this.treeTrunkProgram = glUtil.newProgramWithString( this.treeTrunkGL, vString, fString );
    this.treeTrunkProgram.uSampleTreeTrunk = this.treeTrunkGL.getUniformLocation( this.treeTrunkProgram, "uSamplerTreeTrunk" );
    this.treeTrunkProgram.uWind = this.treeTrunkGL.getUniformLocation( this.treeTrunkProgram, "uWind" );
}

Beach.TreeTrunk.prototype.initTreeTrunkBuffer = function()
{
    for( var i = 0; i <= Beach.TreeTrunkJointCounts; ++i )
    {
        for( var j = 0; j <= 360; j += Beach.TreeTrunkAvailableNum )
        {
            var r = Beach.Deg2Rad * j;
            var x = Math.cos( r );
            var y = i * ( 0.8 / Beach.TreeTrunkJointCounts );
            var z = Math.sin( r );

            var u = j / 360;
            var v = i / Beach.TreeTrunkJointCounts;

            var radius = Beach.TreeTrunkRadius - ( i / Beach.TreeTrunkJointCounts ) * 0.03;
            var offsetRadius = Math.tan( i / Beach.TreeTrunkJointCounts ) / 10;

            this.vertexs.push( x * radius + offsetRadius );
            this.vertexs.push( y );
            this.vertexs.push( z * radius );

            this.uvs.push( u );
            this.uvs.push( v );
        }
    }

    for( var i = 0; i < Beach.TreeTrunkJointCounts; ++i )
    {
        for ( var j = 0; j < ( 360 / Beach.TreeTrunkAvailableNum); ++j )
        {
            var first = ( i * ( ( 360 / Beach.TreeTrunkAvailableNum ) + 1 ) + j );
            var second = first + ( 360 / Beach.TreeTrunkAvailableNum ) + 1;

            this.indices.push( first );
            this.indices.push( second );
            this.indices.push( first + 1 );

            this.indices.push( second );
            this.indices.push( second + 1 );
            this.indices.push( first + 1 );

        }
    }
}

Beach.TreeTrunk.prototype.initTreeTrunkTexture = function( src )
{
    this.treeTrunkTexture = glUtil.newTexture( this.treeTrunkGL, src );
}

Beach.TreeTrunk.prototype.drawTreeTrunk = function( pMatrix, mvMatrix, wind )
{
    this.treeTrunkGL.useProgram( this.treeTrunkProgram );
    glUtil.updateMatrixUniforms( this.treeTrunkGL, this.treeTrunkProgram, pMatrix, mvMatrix );

    this.treeTrunkGL.uniform1f( this.treeTrunkProgram.uWind, wind );

    this.treeTrunkGL.activeTexture( this.treeTrunkGL.TEXTURE0 );
    this.treeTrunkGL.bindTexture( this.treeTrunkGL.TEXTURE_2D, this.treeTrunkTexture );
    this.treeTrunkGL.uniform1i( this.treeTrunkProgram.uSampleTreeTrunk, 0 );

    var renderInfo =
    {
        vertexs: this.vertexs,
        indices: this.indices,
        uvs: this.uvs,
    }

    this.drawTreeTrunkBuffer = glUtil.updateInfo( this.treeTrunkGL, this.treeTrunkProgram, renderInfo );

    glUtil.render( this.treeTrunkGL, this.drawTreeTrunkBuffer );
}

Beach.TreeTrunk.prototype.renderTreeTrunk = function( pMatrix, mvMatrix, wind )
{
    this.drawTreeTrunk( pMatrix, mvMatrix, wind );
}
/**
 * Created by Oliner on 16/8/1.
 */

Beach.Sky = function( gl )
{
    this.skyGL = ( undefined !== gl ) ? ( gl ) : ( glUtil.newWebGL( document.getElementById( "beach" ) ) );

    this.vertexs    = [];
    this.uvs        = [];
    this.indices    = [];

    this.initSkyProgram();
    this.initSkyBuffer();
    this.initSkyTexture( "../../res/sky.jpg" );
}

Beach.Sky.prototype.initSkyProgram = function()
{
    var vString = "precision mediump float;\
                    attribute vec3 aPosition;\
                    attribute vec2 aCoord;\
                    uniform mat4 uPMatrix;\
                    uniform mat4 uMVMatrix;\
                    varying vec2 vCoord;\
                    void main(){\
                        gl_Position = uPMatrix * uMVMatrix * vec4( aPosition, 1.0 );\
                        vCoord = aCoord;\
                    }";

    var fString = "precision mediump float;\
                    uniform sampler2D uSamplerSky;\
                    varying vec2 vCoord;\
                    void main(){\
                        gl_FragColor = texture2D( uSamplerSky, vec2( vCoord.s, vCoord.t ) );\
                    }";

    this.skyProgram = glUtil.newProgramWithString( this.skyGL, vString, fString );
    this.skyProgram.uSamplerSky = this.skyGL.getUniformLocation( this.skyProgram, "uSamplerSky" );

}

Beach.Sky.prototype.initSkyBuffer = function()
{
    this.vertexs = [ -3.0, -1.2, 0.0,
                      3.0, -1.2, 0.0,
                      3.0,  1.5, 0.0,
                     -3.0,  1.5, 0.0 ];

    this.uvs = [ 0.0, 0.0,
                 1.0, 0.0,
                 1.0, 1.0,
                 0.0, 1.0 ];

    this.indices = [ 0, 1, 2, 0, 2, 3 ];
}

Beach.Sky.prototype.initSkyTexture = function( src )
{
    this.skyTexture = glUtil.newTexture( this.skyGL, src );
}

Beach.Sky.prototype.drawSky = function( pMatrix, mvMatrix )
{
    this.skyGL.useProgram( this.skyProgram );
    glUtil.updateMatrixUniforms( this.skyGL, this.skyProgram, pMatrix, mvMatrix );

    this.skyGL.activeTexture( this.skyGL.TEXTURE0 );
    this.skyGL.bindTexture( this.skyGL.TEXTURE_2D, this.skyTexture );
    this.skyGL.uniform1i( this.skyProgram.uSamplerSky, 0 );

    var renderInfo =
    {
        vertexs: this.vertexs,
        indices: this.indices,
        uvs: this.uvs,
    }

    this.drawSkyBuffer = glUtil.updateInfo( this.skyGL, this.skyProgram, renderInfo );

    glUtil.render( this.skyGL, this.drawSkyBuffer );
}

Beach.Sky.prototype.renderSky = function( pMatrix, mvMatrix )
{
    this.drawSky( pMatrix, mvMatrix );
}
/**
 * Created by Oliner on 16/8/1.
 */

Beach.TreeLeaves = function( gl )
{
    this.treeLeavesGL = ( undefined !== gl ) ? ( gl ) : ( glUtil.newWebGL( document.getElementById( "beach" ) ) );

    this.vertexs    = [];
    this.uvs        = [];
    this.indices    = [];
    this.colors     = [];

    this.initTreeLeavesProgram();
    this.initTreeLeavesBuffer();
    this.initTreeLeavesTexture( "../../res/leave.png" );
}

Beach.TreeLeaves.prototype.initTreeLeavesProgram = function()
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
                    uniform sampler2D uSamplerTreeLeaves;\
                    varying vec2 vCoord;\
                    varying vec4 vColor;\
                    void main(){\
                        gl_FragColor = texture2D( uSamplerTreeLeaves, vec2( vCoord.s, vCoord.t ) );\
                    }";

    this.treeLeavesProgram = glUtil.newProgramWithString( this.treeLeavesGL, vString, fString );
    this.treeLeavesProgram.uSamplerTreeLeaves = this.treeLeavesGL.getUniformLocation( this.treeLeavesProgram, "uSamplerTreeLeaves" );
    this.treeLeavesProgram.uWind = this.treeLeavesGL.getUniformLocation( this.treeLeavesProgram, "uWind" );
}

Beach.TreeLeaves.prototype.initTreeLeavesBuffer = function()
{
    var midx = Math.tan( 1 ) / 10;

    this.vertexs = [ midx - 0.2, 0.725, 0.0,
        midx + 0.2, 0.725, 0.0,
        midx + 0.2, 0.825, 0.0,
        midx - 0.2, 0.825, 0.0 ];

    this.uvs = [ 0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0 ];


    this.indices = [ 0, 1, 2, 0, 2, 3 ];
}

Beach.TreeLeaves.prototype.initTreeLeavesTexture = function( src )
{
    this.treeLeavesTexture = glUtil.newTexture( this.treeLeavesGL, src );
}

Beach.TreeLeaves.prototype.drawTreeLeaves = function( pMatrix, mvMatrix, wind )
{
    this.treeLeavesGL.useProgram( this.treeLeavesProgram );
    glUtil.updateMatrixUniforms( this.treeLeavesGL, this.treeLeavesProgram, pMatrix, mvMatrix );

    this.treeLeavesGL.uniform1f( this.treeLeavesProgram.uWind, wind );

    this.treeLeavesGL.activeTexture( this.treeLeavesGL.TEXTURE0 );
    this.treeLeavesGL.bindTexture( this.treeLeavesGL.TEXTURE_2D, this.treeLeavesTexture );
    this.treeLeavesGL.uniform1i( this.treeLeavesProgram.uSamplerTreeLeaves, 0 );

    var renderInfo =
    {
        vertexs: this.vertexs,
        indices: this.indices,
        uvs: this.uvs,
    }

    this.drawTreeLeavesBuffer = glUtil.updateInfo( this.treeLeavesGL, this.treeLeavesProgram, renderInfo );

    glUtil.render( this.treeLeavesGL, this.drawTreeLeavesBuffer );
}

Beach.TreeLeaves.prototype.renderTreeLeaves = function( pMatrix, mvMatrix, wind )
{
    this.drawTreeLeaves( pMatrix, mvMatrix, wind );
}
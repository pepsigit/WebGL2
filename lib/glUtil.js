/**
 * Created by Oliner on 16/7/15.
 */

var glUtil = {}

glUtil.USE_DEFAULT              = 0;
glUtil.USE_ARRAY_BUFFER         = 1;
glUtil.USE_ELEMENT_ARRAY_BUFFER = 2;

function getShaderSource( id )
{
    var shaderScript = document.getElementById( id );

    if( !shaderScript )
    {
        console.error( "****** Shader Script is null. ******");
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while(k)
    {
        if( 3 === k.nodeType )
        {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    return str;
}

function handleLoadedTexture( gl, texture )
{

    gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
    gl.pixelStorei( gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true );

    gl.bindTexture( gl.TEXTURE_2D, texture );

    var format = ( ( texture.image.src.endsWith('.gif') ) || ( texture.image.src.endsWith('.png') ) ) ? ( gl.RGBA ) : ( gl.RGB );
    gl.texImage2D( gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, texture.image );

    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
    //gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
    gl.generateMipmap( gl.TEXTURE_2D );

    gl.bindTexture( gl.TEXTURE_2D, null );

}

glUtil.newWebGL = function( canvas )
{
    if( canvas )
    {
        var gl = canvas.getContext( "experimental-webgl" );

        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        return gl;
    }

    console.error( " ****** WebGL Init Failed. ****** " );
    return ;
}

glUtil.reset = function( gl, isDepth )
{
    if( !gl )
    {
        return ;
    }

    var _isDepth = ( isDepth !== undefined ) ? ( isDepth ) : ( true );

    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    ( _isDepth ) ? ( gl.enable( gl.DEPTH_TEST ) ) : ( gl.disabled( gl.DEPTH_TEST ) );
}

glUtil.updateView = function( gl )
{
    if( !gl )
    {
        return ;
    }

    gl.viewport( 0, 0, gl.viewportWidth, gl.viewportHeight );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
}

glUtil.newProgramWithScriptId = function( gl, vid, fid )
{
    if( !gl )
    {
        return null;
    }

    var vSource = getShaderSource( vid );
    var fSource = getShaderSource( fid );

    return ( glUtil.newProgramWithString( gl, vSource, fSource ) );
}

glUtil.newProgramWithString = function( gl, vString, fString )
{
    if( !gl )
    {
        console.error( "glUtil.newProgramWithString : gl is null." );
        return null;
    }

    var vShader, fShader, program;

    var vSource = vString;
    var fSource = fString;

    //console.log( "vSource: ", vSource );
    //console.log( "fSource: ", fSource );

    /* ****** */

    vShader = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource( vShader, vSource );
    gl.compileShader( vShader );

    fShader = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource( fShader, fSource );
    gl.compileShader( fShader );

    /* ****** */

    program = gl.createProgram();
    gl.attachShader( program, vShader );
    gl.attachShader( program, fShader );
    gl.linkProgram( program );
    //gl.useProgram( program );

    if( !program )
    {
        console.log( " ****** Program Init Failed. ****** ", program );

        return ;
    }

    program.vertexPositionAttribute = gl.getAttribLocation( program, "aPosition" );
    gl.enableVertexAttribArray( program.vertexPositionAttribute );

    program.vertexColorAttribute = gl.getAttribLocation( program, "aColor" );
    if( -1 !== program.vertexColorAttribute )
    {
        gl.enableVertexAttribArray( program.vertexColorAttribute );
    }

    program.vertexCoordAttribute = gl.getAttribLocation( program, "aCoord" );
    if( -1 !== program.vertexCoordAttribute )
    {
        gl.enableVertexAttribArray( program.vertexCoordAttribute );
    }

    program.pMatrix   = gl.getUniformLocation( program, "uPMatrix");
    program.mvMatrix  = gl.getUniformLocation( program, "uMVMatrix");

    //console.log( program.vertexPositionAttribute, program.vertexColorAttribute, program.vertexCoordAttribute,
    // program.pMatrix, program.mvMatrix );

    return program;
}

//glUtil.newProgram = function( gl, vid, fid )
//{
//    if( !gl )
//    {
//        return null;
//    }
//
//    var vShader, fShader, program;
//
//    var vSource = getShaderSource( vid );
//    var fSource = getShaderSource( fid );
//
//    //console.log( "vSource: ", vSource );
//    //console.log( "fSource: ", fSource );
//
//    /* ****** */
//
//    vShader = gl.createShader( gl.VERTEX_SHADER );
//    gl.shaderSource( vShader, vSource );
//    gl.compileShader( vShader );
//
//    fShader = gl.createShader( gl.FRAGMENT_SHADER );
//    gl.shaderSource( fShader, fSource );
//    gl.compileShader( fShader );
//
//    /* ****** */
//
//    program = gl.createProgram();
//    gl.attachShader( program, vShader );
//    gl.attachShader( program, fShader );
//    gl.linkProgram( program );
//    //gl.useProgram( program );
//
//    if( !program )
//    {
//        console.log( " ****** Program Init Failed. ****** ", program );
//
//        return ;
//    }
//
//    program.vertexPositionAttribute = gl.getAttribLocation( program, "aPosition" );
//    gl.enableVertexAttribArray( program.vertexPositionAttribute );
//
//    program.vertexColorAttribute = gl.getAttribLocation( program, "aColor" );
//    if( -1 !== program.vertexColorAttribute )
//    {
//        gl.enableVertexAttribArray( program.vertexColorAttribute );
//    }
//
//    program.vertexCoordAttribute = gl.getAttribLocation( program, "aCoord" );
//    if( -1 !== program.vertexCoordAttribute )
//    {
//        gl.enableVertexAttribArray( program.vertexCoordAttribute );
//    }
//
//    program.pMatrix   = gl.getUniformLocation( program, "uPMatrix");
//    program.mvMatrix  = gl.getUniformLocation( program, "uMVMatrix");
//
//    //console.log( program.vertexPositionAttribute, program.vertexColorAttribute, program.vertexCoordAttribute,
//    // program.pMatrix, program.mvMatrix );
//
//    return program;
//
//}

glUtil.updateMatrixUniforms = function( gl, program, pMatrix, mvMatrix )
{
    if( !program || !gl )
    {
        return ;
    }

    //console.log( "glUtil.updateMatrixUniforms :", program.pMatrix );
    //console.log( "glUtil.updateMatrixUniforms :", program.mvMatrix );
    gl.uniformMatrix4fv( program.pMatrix, false, pMatrix.toArray() );
    gl.uniformMatrix4fv( program.mvMatrix, false, mvMatrix.toArray() );
}

glUtil.newTexture = function( gl, srcPath, isAlpha )
{
    if( !srcPath || !gl )
    {
        return ;
    }

    var texture = gl.createTexture();
    texture.image = new Image();

    texture.image.onload = function()
    {
        handleLoadedTexture( gl, texture, ( ( undefined !== isAlpha ) ? ( isAlpha ) : ( false ) ) );
    }

    texture.image.src = srcPath;

    return texture
}

/*
 * @param gl            WebGL
 * @param program       Program
 * @param renderInfo    Renderer Info
 */
glUtil.updateInfo = function( gl, program, renderInfo )
{
    if( !gl || !program || ( -1 === program.vertexPositionAttribute ) )
    {
        return ;
    }

    var vertexsPositionBuffer,
        vertexsColorBuffer,
        vertexsUvsBuffer,
        indicesInfo;

    var vertexsInfo = renderInfo.vertexs,
        indicesInfo = renderInfo.indices,
        colorsInfo  = renderInfo.colors,
        uvsInfo     = renderInfo.uvs;

    if( ( undefined === vertexsInfo ) )
    {
        console.error( " ****** VertexsInfo is undefined. ****** " );

         return ;
    }
    else if( ( 0 >= vertexsInfo.length ) )
    {
        console.warn( " ****** VertexsInfo Length is 0 ****** " );
    }


    var renderBuffer;

    /* ****** Position Buffer ****** */

    vertexsPositionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vertexsPositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertexsInfo ), gl.STATIC_DRAW );
    gl.vertexAttribPointer( program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0 );
    vertexsPositionBuffer.numItems = vertexsInfo.length / 3;

    /* ****** Color Buffer ****** */

    colorsInfo = ( colorsInfo !== undefined ) ? ( colorsInfo ) : ( [] );

    if( -1 !== program.vertexColorAttribute )
    {
        if( 0 >= colorsInfo.length )
        {
            for( var i = 0; i < ( vertexsInfo.length + vertexsPositionBuffer.numItems ); ++i )
            {
                colorsInfo.push( 1.0 );
            }
        }

        vertexsColorBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vertexsColorBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( colorsInfo ), gl.STATIC_DRAW );
        gl.vertexAttribPointer( program.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0 );
        vertexsColorBuffer.numItems = colorsInfo.length / 4;
    }

    /* ****** Coord Buffer ****** */

    if( -1 !== program.vertexCoordAttribute )
    {
        if( uvsInfo !== undefined )
        {
            vertexsUvsBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, vertexsUvsBuffer );
            gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( uvsInfo ), gl.STATIC_DRAW );
            gl.vertexAttribPointer( program.vertexCoordAttribute, 2, gl.FLOAT, false, 0, 0 );
            vertexsUvsBuffer.numItems = uvsInfo.length / 2;
        }
    }

    /* ****** Indices Buffer ****** */

    if( indicesInfo !== undefined )
    {
        indicesBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indicesBuffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indicesInfo ), gl.STATIC_DRAW );
        indicesBuffer.numItems = indicesInfo.length;

        renderBuffer = { "buffer": indicesBuffer, type: glUtil.USE_ELEMENT_ARRAY_BUFFER };

        return renderBuffer;
    }

    renderBuffer = { "buffer": vertexsPositionBuffer, type: glUtil.USE_ARRAY_BUFFER };

    return renderBuffer;

}

glUtil.render = function( gl, renderBuffer )
{
    switch ( renderBuffer.type )
    {
        case ( glUtil.USE_ARRAY_BUFFER ) :
        {
            //console.log( " ****** Use ARRAY_BUFFER ****** " );
            gl.drawArrays( gl.TRIANGLE_STRIP, 0, renderBuffer.buffer.numItems );
            //gl.drawArrays( gl.POINTS, 0, renderBuffer.buffer.numItems );
            break;
        }

        case ( glUtil.USE_ELEMENT_ARRAY_BUFFER ) :
        {
            //console.log( " ****** Use ELEMENT_ARRAY_BUFFER ****** " );
            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, renderBuffer.buffer );
            gl.drawElements( gl.TRIANGLES, renderBuffer.buffer.numItems, gl.UNSIGNED_SHORT, 0);
            break;
        }

        default:

            console.error( " ****** Can not Draw Anything ****** " );
            break;

    }
}










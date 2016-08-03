/**
 * Created by Oliner on 16/7/28.
 */

window.onload = function()
{
    var gl = glUtil.newWebGL( document.getElementById( "beach" ) );

    var pMatrix = okMat4Proj( 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0 );

    var mvMatrix;

    glUtil.reset( gl, true );

    // 创建沙滩
    var land = new Beach.Land( gl );
    // 创建海水
    var water = new Beach.Water( gl );
    // 创建树干
    var treeTrunk = new Beach.TreeTrunk( gl );
    // 创建背景天空
    var sky = new Beach.Sky( gl );
    // 创建树叶
    var treeLeaves = new Beach.TreeLeaves( gl );


    var xStartAngle = 0.0;
    var lastTime    = 0.0;
    var wind        = 0.0;
    var step        = 0.01;

    function animate()
    {
        var timeNow = Date.now();
        if( 0 != lastTime )
        {
            var subTime = timeNow - lastTime;

            xStartAngle += 0.05;
            wind += step;

            if( 1.0e20 < xStartAngle )
            {
                xStartAngle = 0.0;
            }

            if( 0.9 < wind || 0.0 >= wind )
            {
                step *= -1;
            }

        }
        lastTime = timeNow;
    }

    var mvMatrixStack = [];

    function mvPushMatrix()
    {
        var copy = new okMat4();
        mvMatrixStack.push( copy );
    }

    function mvPopMatrix()
    {
        if ( 0 == mvMatrixStack.length )
        {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }

    function drawObjects()
    {
        /*****************************/

        mvPushMatrix();

        mvMatrix = okMat4Trans( 0.0, 1, -5.0 );
        sky.renderSky( pMatrix, mvMatrix );

        mvPopMatrix();


        /************* tree 1. ****************/

        mvPushMatrix();

        mvMatrix = okMat4Trans( -1.6, -0.3, -4 );
        mvMatrix.rotX( OAK.SPACE_LOCAL, 9, true );

        treeTrunk.renderTreeTrunk( pMatrix, mvMatrix, wind );

        mvPopMatrix();

        /************* tree 2. ****************/

        mvPushMatrix();

        mvMatrix = okMat4Trans( -0.8, -0.3, -3.5 );
        mvMatrix.rotX( OAK.SPACE_LOCAL, 9, true );

        treeTrunk.renderTreeTrunk( pMatrix, mvMatrix, wind );

        mvPopMatrix();

        /************* tree 3. ****************/

        mvPushMatrix();

        mvMatrix = okMat4Trans( -1.0, -0.3, -3.2 );
        mvMatrix.rotX( OAK.SPACE_LOCAL, 9, true );

        treeTrunk.renderTreeTrunk( pMatrix, mvMatrix, wind );

        mvPopMatrix();

        /************* tree 4. ****************/

        mvPushMatrix();

        mvMatrix = okMat4Trans( -0.6, -0.3, -2.8 );
        mvMatrix.rotX( OAK.SPACE_LOCAL, 9, true );

        treeTrunk.renderTreeTrunk( pMatrix, mvMatrix, wind );

        mvPopMatrix();

        /************* tree 5. ****************/

        mvPushMatrix();

        mvMatrix = okMat4Trans( -0.3, -0.3, -2.2 );
        mvMatrix.rotX( OAK.SPACE_LOCAL, 9, true );

        treeTrunk.renderTreeTrunk( pMatrix, mvMatrix, wind );

        mvPopMatrix();

        /************* tree 6. ****************/

        mvPushMatrix();

        mvMatrix = okMat4Trans( -0.0, -0.3, -2.0 );
        mvMatrix.rotX( OAK.SPACE_LOCAL, 9, true );

        treeTrunk.renderTreeTrunk( pMatrix, mvMatrix, wind );

        mvPopMatrix();

        /*************** leave 1. **************/

            //gl.disable( gl.DEPTH_TEST );
        gl.enable( gl.BLEND );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

        mvPushMatrix();

        mvMatrix = okMat4Trans( -1.6, -0.3, -4 );
        mvMatrix.rotX( OAK.SPACE_LOCAL, 9, true );

        treeLeaves.renderTreeLeaves( pMatrix, mvMatrix, wind );

        mvPopMatrix();

        /*************** leave 2. **************/

        mvPushMatrix();

        mvMatrix = okMat4Trans( -0.8, -0.3, -3.5 );
        mvMatrix.rotX( OAK.SPACE_LOCAL, 9, true );

        treeLeaves.renderTreeLeaves( pMatrix, mvMatrix, wind );

        mvPopMatrix();

        /*************** leave 3. **************/

        mvPushMatrix();

        mvMatrix = okMat4Trans( -1.0, -0.3, -3.2 );
        mvMatrix.rotX( OAK.SPACE_LOCAL, 9, true );

        treeLeaves.renderTreeLeaves( pMatrix, mvMatrix, wind );

        mvPopMatrix();

        /*************** leave 4. **************/

        mvPushMatrix();

        mvMatrix = okMat4Trans( -0.6, -0.3, -2.8 );
        mvMatrix.rotX( OAK.SPACE_LOCAL, 9, true );

        treeLeaves.renderTreeLeaves( pMatrix, mvMatrix, wind );

        mvPopMatrix();

        /*************** leave 5. **************/

        mvPushMatrix();

        mvMatrix = okMat4Trans( -0.3, -0.3, -2.2 );
        mvMatrix.rotX( OAK.SPACE_LOCAL, 9, true );

        treeLeaves.renderTreeLeaves( pMatrix, mvMatrix, wind );

        mvPopMatrix();

        /*************** leave 6. **************/

        mvPushMatrix();

        mvMatrix = okMat4Trans( -0.0, -0.3, -2.0 );
        mvMatrix.rotX( OAK.SPACE_LOCAL, 9, true );

        treeLeaves.renderTreeLeaves( pMatrix, mvMatrix, wind );

        mvPopMatrix();

        gl.disable( gl.BLEND );
        gl.enable( gl.DEPTH_TEST );

        /*****************************/

        mvPushMatrix();

        mvMatrix = okMat4Trans( 0.0, -0.3, -2.0 );
        mvMatrix.rotX( OAK.SPACE_LOCAL, 9, true );

        land.renderLand( pMatrix, mvMatrix );
        water.renderWater( pMatrix, mvMatrix, xStartAngle );

        mvPopMatrix();

    }

    function tick()
    {
        glUtil.updateView( gl );
        requestAnimationFrame( tick );

        drawObjects();
        animate();
    }

    tick();

}
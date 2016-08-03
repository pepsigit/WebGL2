/**
 * Created by Oliner on 16/7/28.
 */

Beach = {};

Beach.Deg2Rad = Math.PI / 180;

// 陆地 X 平分
Beach.LandWidth = 100;
// 陆地 Z 平分
Beach.LandHeight = 50;
Beach.LandWidthStep = 1 / ( Beach.LandWidth / 2);
Beach.LandHeightStep = 1 / ( Beach.LandHeight / 2 );

// 树干底端半径
Beach.TreeTrunkRadius = 0.05;
// 树干节数
Beach.TreeTrunkJointCounts = 20;
// 树干圆边有效点
Beach.TreeTrunkAvailableNum = 20;


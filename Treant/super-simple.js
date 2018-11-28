
var simple_chart_config = {
	chart: {
		container: "#OrganiseChart-simple"
	},
	
	nodeStructure: {
		text: { name: "0" },
		children: [
			{
				text: { name: "01" },
				children: [
					{
						text: { name: "01-1" }
					},
					{
						text: { name: "01-2" }
					}
				]
			},
			{
				text: { name: "02" },
				children: [
					{
						text: { name: "02-1" }
					},
					{
						text: { name: "02-2" }
					},
					{
						text: { name: "02-3" }
					}
				]
			}
		]
	}
};

// // // // // // // // // // // // // // // // // // // // // // // // 
/*
var config = {
	container: "#OrganiseChart-simple"
};

var parent_node = {
	text: { name: "Parent node" }
};

var first_child = {
	parent: parent_node,
	text: { name: "First child" }
};

var second_child = {
	parent: parent_node,
	text: { name: "Second child" }
};

var simple_chart_config = [
	config, parent_node,
		first_child, second_child 
];
*/
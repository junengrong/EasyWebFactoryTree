# EasyWebFactoryTree
this is a tree component, jquery and font-awesome is required

# tree category for example:

        var categorydata = [{
                id: 2,
                title: '陕西' //一级菜单
                , children: [{
                    id: 21,
                    title: '西安' //二级菜单
                }]
            }, {
                id: 1,
                title: '江西' //一级菜单
                , children: [{
                    id: 11,
                    title: '南昌' //二级菜单
                    , children: [{
                        id: 111,
                        title: '高新区' //三级菜单
                        //…… //以此类推，可无限层级
                    }, {
                        id: 1112,
                        title: '高新区2' //三级菜单
                        //…… //以此类推，可无限层级
                    }]
                }, {
                    id: 11,
                    title: '南昌' //二级菜单
                    , children: [{
                        id: 111,
                        title: '高新区' //三级菜单
                        //…… //以此类推，可无限层级
                    }, {
                        id: 1112,
                        title: '高新区2' //三级菜单
                        //…… //以此类推，可无限层级
                    }]
                }]
            }];

           $("#categorytree").EasyWebFactoryTree({
                data: categorydata,
                menuClick: function (itemdata, mouseEvent) {
                   //use this event will display 3 flow button (add,edit,delete)
                    var $obj = $(mouseEvent.target); // this is 
                    if ($obj.hasClass("fa-remove")) {
                        // delete button is clicked
                    } else if ($obj.hasClass("fa-plus")) {
                        // add button is clicked
                    } else if ($obj.hasClass("fa-edit")) {
                       // edit button is clicked
                    }
                    console.log($obj);
                },
                itemClick: function (rowdata, $treeitem) {
                  // this is click event
                    console.log(rowdata);
                }
            });

 # dropdownlist example:
 
                $("#selectId").EasyWebFactorySelect({
                    data: categorydata,
                    select: function (item) {
                       // console.log(item);
                    }
                });
                //set selected value
                $("#selectId").EasyWebFactorySelectSet("value", "");
                //get selected value 
                var value = $("#selectId").EasyWebFactorySelectGet();
                //get options
                var options= $("#selectId").getOptions();

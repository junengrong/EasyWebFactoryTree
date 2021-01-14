(function($) {
    "use strict";
    
    function EasyWebFactoryTree($self, options) {
        var _options = {
            menuClick: "function (itemdata, $treeitem) { }",
            itemClick: "function (itemdata, $treeitem) { }"
        };
        $.extend(_options, options || {});
        this.$options = _options;
        this.$control = $self;
        this.$flowlayer = $('<div style="display:none"></div>');
        this.renderTree();
        this.renderMenu();
        this.bindEvent();
    };

    EasyWebFactoryTree.prototype.renderTreeNode = function ($nodePane, arrayData, level) {
        var $newNodeTitle;
        var arraylength = arrayData.length - 1;
        var $this = this;
        arrayData.forEach(function (o, i) {
            $newNodeTitle = $('<div class="tree-node-title"></div>');
            $newNodeTitle[0].data = o;
            $newNodeTitle.append('<i class="tree-node-line"></i>');
            for (var v = 0; v < level - 1; v++) {
                $newNodeTitle.append('<i class="tree-node-line" lv="' + v + '"></i>');
            }
            if (level > 0) {
                $newNodeTitle.append('<i v="node" class="tree-node-line tree-node-vline tree-node-hline" lv="' + v + '"></i>');
            }
            var _state = o.state == "0" ? 'class="tree-node-title-hidden"' : "";
            if (!!o.children && o.children.length > 0) {
                //fa-minus-square-o,fa fa-plus-square-o
                $newNodeTitle.append('<i class="tree-node-btn fa fa-minus-square-o"></i><i class="fa fa-folder-open"></i><span val="' + o.id + '" ' + _state +'> ' + o.title + '</span>');
                $newNodeTitle.appendTo($nodePane);
                var $newNodePane = $('<div class="tree-node-pane"></div>').appendTo($nodePane);

                if (i == arraylength) {
                     //最后节点
                    $newNodePane.addClass("tree-node-last");
                    //    //画线
                    var icons = $nodePane.find("i[lv=" + level + "]");
                    icons.each(function (i, o) {
                        $(o).addClass("tree-node-vline");
                    });
                    if (level - 1 > -1) {
                        //最后一个子节点
                        icons = $nodePane.find("i[lv=" + (level - 1) + "]");
                        icons.each(function (i, o) {
                            $(o).addClass("tree-node-vline");
                        });
                        $newNodeTitle.find("i[v='node']").removeClass("tree-node-vline").addClass("tree-lastnode-vline");
                    } else {
                        $newNodeTitle.find("i[v='node']").removeClass("tree-node-vline").addClass("tree-lastnode-vline");
                    }
                }

                $newNodeTitle = $this.renderTreeNode($newNodePane, o.children, level + 1);
            } else {
                $newNodeTitle.append('<i class="fa fa-file-o"></i><span val="' + o.id + '" ' + _state +'> ' + o.title + '</span>');
                $newNodeTitle.appendTo($nodePane);
                if (i == arraylength) {
                    var icons = $nodePane.find("i[lv=" + level + "]");
                    icons.each(function (i, o) {
                        $(o).addClass("tree-node-vline");
                    });
                }
            }
            
        });

        return $newNodeTitle;
    };
    EasyWebFactoryTree.prototype.renderTree = function () {
        var $node = $('<div class="tree-node-pane"></div>');
        var $lastNodeTitle = this.renderTreeNode($node, this.$options.data, 0);
        if (!!$lastNodeTitle) {
            $lastNodeTitle.find("i[v='node']").removeClass("tree-node-vline").addClass("tree-lastnode-vline");
        }
        return this.$control.empty().append($node);
    };
    EasyWebFactoryTree.prototype.renderMenu = function () {
        this.$flowlayer = $('<div style="position:absolute;color:#000;z-index:999;display:none;white-space: nowrap;text-align: right;right: 0px;"><a class="fa fa-plus"></a> <a class="fa fa-edit"></a> <a class="fa fa-remove"></a></div>').appendTo(this.$control);
        return this.$flowlayer;
    };
    EasyWebFactoryTree.prototype.bindEvent = function () {
        var _ops = this.$options;
        var $this = this;
        this.$control.unbind().on("click", ".tree-node-title", function () {
            //fa-minus-square-o,fa fa-plus-square-o
            if (!!$this.selecteditem) {
                $this.selecteditem.removeClass("tree-node-title-selected");
            }
            $this.selecteditem = $(this).addClass("tree-node-title-selected");
            var returnback = _ops.itemClick.call($this.selecteditem, $this.selecteditem[0].data, $this.selecteditem);
            
            if (typeof (_ops.itemClick) != "function" || !!returnback) {
                $this.selecteditem.next(".tree-node-pane").toggle("fast",
                    function () {
                        if ($this.selecteditem.find('.fa-plus-square-o').length > 0) {
                            $this.selecteditem.find('.fa-plus-square-o').removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
                            $this.selecteditem.find('.fa-folder').removeClass("fa-folder").addClass("fa-folder-open");
                        } else {
                            $this.selecteditem.find('.fa-minus-square-o').removeClass("fa-minus-square-o").addClass("fa-plus-square-o");
                            $this.selecteditem.find('.fa-folder-open').removeClass("fa-folder-open").addClass("fa-folder");
                        }
                    });
            }
        }).on("mouseenter", ".tree-node-title", function (e) {
            if (typeof (_ops.menuClick) == "function") {
                var treeitem = $(this);
                var left = treeitem.width() - 45;
                var top = treeitem.offset().top - $this.$control.offset().top + 2;
                $this.$flowlayer.css({ top: top + "px", display: "inline" });
                $this.$flowlayer.unbind();
                $this.$flowlayer.bind("click", function (e) {
                    if (!!$this.selecteditem) {
                        $this.selecteditem.removeClass("tree-node-title-selected");
                    }
                    $this.selecteditem = treeitem.addClass("tree-node-title-selected");
                    _ops.menuClick.call(this, treeitem[0].data, e);
                    e.stopPropagation();
                });
                $this.$flowlayer.bind("mouseout", function () {
                    $this.$flowlayer.hide();
                });
            }
            });

        this.$control.on("click", ".tree-node-btn", function (e) {
            //fa-minus-square-o,fa fa-plus-square-o
            var $this = $(this).parent();
            $this.next(".tree-node-pane").toggle("fast",
                function () {
                    if ($this.find('.fa-plus-square-o').length > 0) {
                        $this.find('.fa-plus-square-o').removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
                        $this.find('.fa-folder').removeClass("fa-folder").addClass("fa-folder-open");
                    } else {
                        $this.find('.fa-minus-square-o').removeClass("fa-minus-square-o").addClass("fa-plus-square-o");
                        $this.find('.fa-folder-open').removeClass("fa-folder-open").addClass("fa-folder");
                    }
                });
            e.stopPropagation();
            return;
        })
    };

    
    $.fn.EasyWebFactoryTree = function (options) {
        var $self = $(this);
        if ($self.length == 0) {
            return $self;
        }
        $self.css({ position:"relative"});
        var tree = new EasyWebFactoryTree($self, options);
        $self.getOptions = function () {
            return tree.$options;
        }
        $self.getMenu = function () {
            return tree.$flowlayer;
        }
        $self[0].getOptions = function () {
            return tree.$options;
        }
        $self[0].getMenu = function () {
            return tree.$flowlayer;
        }
        return $self;
    }
    $.fn.EasyWebFactorySelect = function (options) {
        options = options || {};
        var $this = $(this);
        var id = $this.attr("id");
        var placeholder = $this.attr("placeholder");
        if (!placeholder) {
            placeholder = "请选择";
        } 
        var $control = $('<input type="text" placeholder="' + placeholder +'" value="" readonly="readonly">');
        var $value = $('<input name="' + id +'" type="hidden" value = "" >');
        $this.append($control).append($value);

        var $self = $("<div>").css({ position: "absolute", display: "none", top: "36px", left: "0px", "z-index": 20,background:"#fff", overflow:"auto",border:"solid 1px #ccc", height: "200px", width: $this.width()+"px" }).appendTo(this);
        $control.on("click", function (e) {
            $self.show();
            e.stopPropagation();
        });
        $("body").on("click", function () {
            $self.hide();
        });
        options.menuClick = null;
        options.itemClick = function (rowdata, $treeitem) {
            var callresult = true;
            if (!!options.select) {
               callresult = options.select.call($treeitem, rowdata);
            }
            if (callresult == undefined || callresult == true) {
                $self.hide();
                $control.val(rowdata.title);
                $value.val(rowdata.id);
            } else {
                return false;
            }
        }

        if ($self.length == 0) {
            return $self;
        }
        var tree = new EasyWebFactoryTree($self, options);
        $this.getOptions = function () {
            return tree.$options;
        }
        $this[0].getOptions = function () {
            return tree.$options;
        }
        return $self;
    }
    $.fn.EasyWebFactorySelectSet = function (type, data) {
        var $this = $(this);
        if (type == "value") {
            var finditem = $this.find('span[val="' + data + '"]').parent();
            if (finditem.length > 0) {
                var itemdata = finditem[0].data;
                $this.children("input[type=text]").val(itemdata.title);
                $this.children("input[type=hidden]").val(data);
            } else {
                $this.children("input[type=text]").val("");
                $this.children("input[type=hidden]").val("");
            }
        } else if (type == "reload") {
            var options = $this[0].getOptions();
            options.data = data;
            new EasyWebFactoryTree($this.children("div"), options);
        }
    }
    $.fn.EasyWebFactorySelectGet = function () {
        var $this = $(this);
        $this.children("input[type=hidden]").val();
    }
})(jQuery)
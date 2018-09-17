Array.prototype.contains = function (val, attr) {
    for (i in this) {
        if (this[i][attr] == val) return true;
    }
    return false;
}


function AppViewModel() {
    var self = this;
    self.nodes = ko.observableArray([]);
    self.edges = ko.observableArray([]);


    //self.names = ['Frankfurt', 'Mannheim', 'Karlsruhe', 'Augsburg', 'Munchen', 'Wurzburg', 'Erfurt', 'Nurnberg', 'Stuttgart', 'Kassel'];
    //var xs = [500, 250, 200, 300, 600, 500, 300, 600, 650, 800];
    //var ys = [100, 300, 500, 700, 900, 300, 500, 500, 300, 400];

    self.names = ['Frankfurt', 'Mannheim', 'Karlsruhe', 'Augsburg', 'Munchen', 'Wurzburg', 'Nurnberg'];
    var xs = [500, 250, 200, 300, 600, 500, 600];
    var ys = [100, 300, 500, 700, 900, 300, 500];
    for (var i = 0; i < 10; i++) {
        self.nodes.push(new NodeViewModel(xs[i], ys[i], self.names[i]));
    }

    self.edgeData = [
        //{
        //    a: 'Frankfurt',
        //    b: 'Mannheim',
        //    d: 85
        //},
        //{
        //    a: 'Mannheim',
        //    b: 'Karlsruhe',
        //    d: 80
        //},
        //{
        //    a: 'Karlsruhe',
        //    b: 'Augsburg',
        //    d: 250
        //},
        //{
        //    a: 'Augsburg',
        //    b: 'Munchen',
        //    d: 84
        //},
        //{
        //    a: 'Munchen',
        //    b: 'Nurnberg',
        //    d: 167
        //},
        //{
        //    a: 'Munchen',
        //    b: 'Kassel',
        //    d: 502
        //},
        //{
        //    a: 'Frankfurt',
        //    b: 'Kassel',
        //    d: 173
        //},
        //{
        //    a: 'Frankfurt',
        //    b: 'Wurzburg',
        //    d: 217
        //},
        //{
        //    a: 'Wurzburg',
        //    b: 'Erfurt',
        //    d: 186
        //},
        //{
        //    a: 'Wurzburg',
        //    b: 'Nurnberg',
        //    d: 103
        //},
        //{
        //    a: 'Nurnberg',
        //    b: 'Stuttgart',
        //    d: 183
        //}
        {
            a: 'Frankfurt',
            b: 'Mannheim',
            d: 85
        },
        {
            a: 'Mannheim',
            b: 'Karlsruhe',
            d: 80
        },
        {
            a: 'Karlsruhe',
            b: 'Augsburg',
            d: 250
        },
        {
            a: 'Augsburg',
            b: 'Munchen',
            d: 81
        },
        {
            a: 'Munchen',
            b: 'Nurnberg',
            d: 170
        },
        {
            a: 'Frankfurt',
            b: 'Wurzburg',
            d: 62
        },
        {
            a: 'Wurzburg',
            b: 'Nurnberg',
            d: 65
        },
        {
            a: 'Nurnberg',
            b: 'Karlsruhe',
            d: 100
        },
        {
            a: 'Nurnberg',
            b: 'Augsburg',
            d: 80
        }
    ]

    for (var i = 0; i < self.edgeData.length; i++) {
        self.edges.push(new EdgeViewModel(self.edgeData[i]));

    }

    self.load = function () {
        var b = document.getElementById('background');
        var ctx = b.getContext('2d');
        for (var i = 0; i < self.edgeData.length; i++) {
            var aIndex = self.names.findIndex(function (a) { return a === self.edgeData[i].a });
            var aX = xs[aIndex];
            var aY = ys[aIndex];
            var bIndex = self.names.findIndex(function (a) { return a === self.edgeData[i].b });
            var bX = xs[bIndex];
            var bY = ys[bIndex];

            ctx.beginPath();
            ctx.moveTo(aX, aY);
            ctx.lineTo(bX, bY);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();

            var midX = (aX + bX) / 2;
            var midY = (aY + bY) / 2;
            ctx.font = '12px arial';
            ctx.fillText(self.edgeData[i].d, midX, midY)
        }

        for (var i = 0; i < self.nodes().length; i++) {
            ctx.rect(self.nodes()[i].x - 25, self.nodes()[i].y - 25, 50, 50);
            ctx.stroke();
            ctx.font = '12px arial';
            ctx.fillText(self.nodes()[i].name, self.nodes()[i].x - 25, self.nodes()[i].y);
        }
    }

    self.selectedDestination = ko.observable('');
    self.findRelatedEdges = function (name) {
        return self.edgeData.filter(function (edge) {
            return edge.a === name || edge.b === name;
        });
    }
    self.innerExecute = function () {

    }

    function findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }

    self.open = [];
    self.closed = [];
    self.root = 'Frankfurt';
    self.open.push({
        Distance: 0,
        Node: 'Frankfurt',
        Previous: '',
        PreviousList: ''
    });
    self.closed.push(self.root);

    function checkCells() {
        var availableEdges = [];
        for (var i = 0; i < self.open.length; i++) {
            var a = self.findRelatedEdges(self.open[i].Node);
            for (var j = 0; j < a.length; j++) {
                if (!(self.closed.includes(a[j].a) && self.closed.includes(a[j].b))) {
                    if (a[j].a === self.open[i].Node) {
                        availableEdges.push({
                            Distance: a[j].d + self.open[i].Distance,
                            Node: a[j].b,
                            Previous: a[j].a,
                            PreviousList: self.open[i].PreviousList
                        });
                    } else {
                        availableEdges.push({
                            Distance: a[j].d + self.open[i].Distance,
                            Node: a[j].a,
                            Previous: a[j].b,
                            PreviousList: self.open[i].PreviousList
                        });
                    }
                }
            }
        }
        availableEdges.sort(function (a, b) {
            return a.Distance - b.Distance;
        });
        console.log(availableEdges);
        var shortest = availableEdges[0];
        availableEdges.splice(0, 1);
        console.log(shortest);
        var splitNode;
        if (availableEdges.contains(shortest.Previous, 'Previous')) {
            self.open.push({
                Distance: shortest.Distance,
                Node: shortest.Node,
                Previous: shortest.Previous,
                PreviousList: shortest.PreviousList + ',' + shortest.Previous
            });
            self.closed.push(shortest.Node);
        } else {
            var index = self.open.findIndex(function (a) {
                return a.Node === shortest.Previous
            })
            var dist = index.Distance;
            self.open.splice(index, 1);
            self.open.push({
                Distance: shortest.Distance,
                Node: shortest.Node,
                Previous: shortest.Previous,
                PreviousList: shortest.PreviousList + ',' + shortest.Previous
            });
            self.closed.push(shortest.Node);
        }
        console.log(self.open);

        if (shortest.Node === self.selectedDestination()) {
            console.log(shortest.PreviousList + ',' + shortest.Previous + ',' + self.selectedDestination());
            return;
        } else {
            checkCells();
        }
    }


    self.execute = function () {
        checkCells();
    }

    window.onload = self.load();
}

function NodeViewModel(x, y, name) {
    var self = this;
    self.x = x;
    self.y = y;
    self.name = name;
}

function EdgeViewModel(data) {
    var self = this;
    self.a = data.a;
    self.b = data.b;
    self.d = data.d;
}

ko.applyBindings(new AppViewModel());
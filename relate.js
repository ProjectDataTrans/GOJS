function initRelate() {
	if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
      var $ = go.GraphObject.make;  // fo
	myRelate =
        $(go.Diagram, "myRelationDiv",
          {
            validCycle: go.Diagram.CycleNotDirected,  // don't allow loops
            // For this sample, automatically show the state of the diagram's model on the page
            "ModelChanged": function(e) {
                if (e.isTransactionFinished) showModel();
              },
            "undoManager.isEnabled": true
          });
         myRelate.addDiagramListener("ObjectDoubleClicked", function (ev) {
          let data = ev.subject.part.data
          let key = data.key
          let fields = data.fields
          let html = `
          <table class="json table-bordered">
          <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            
            </tr>
             </thead>
          `
          let i = 0;
           for(let field of  fields) {
            i++;
              html += `<tr id="${i}">
              <td>
              <span class="tabledit-span tabledit-identifier">${i}</span>
              <input class="tabledit-input tabledit-identifier" type="hidden" name="id" value="${i}">
              </td><td>${field.name}</td></tr>`
            }
          `
          
         
          </table>`
          showJsonModal(html)
        });
      // This template is a Panel that is used to represent each item in a Panel.itemArray.
      // The Panel is data bound to the item object.
      var fieldTemplate =
        $(go.Panel, "TableRow",  // this Panel is a row in the containing Table
          new go.Binding("portId", "name"),  // this Panel is a "port"
          {
            background: "transparent",  // so this port's background can be picked by the mouse
            fromSpot: go.Spot.Right,  // links only go from the right side to the left side
            toSpot: go.Spot.Left,
            // allow drawing links from or to this port:
            fromLinkable: true, toLinkable: true
          },
          $(go.Shape,
            { width: 12, height: 12, column: 0, strokeWidth: 2, margin: 4,
              // but disallow drawing links from or to this shape:
              fromLinkable: false, toLinkable: false },
            new go.Binding("figure", "figure"),
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            { margin: new go.Margin(0, 5), column: 1, font: "bold 13px sans-serif",
              alignment: go.Spot.Left,
              // and disallow drawing links from or to this text:
              fromLinkable: false, toLinkable: false },
            new go.Binding("text", "name")),
          $(go.TextBlock,
            { margin: new go.Margin(0, 5), column: 2, font: "13px sans-serif", alignment: go.Spot.Left },
            new go.Binding("text", "info"))
        );

      // This template represents a whole "record".
      myRelate.nodeTemplate =
        $(go.Node, "Auto",
          { copyable: false, deletable: false },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          // this rectangular shape surrounds the content of the node
          $(go.Shape,
            { fill: "#EEEEEE" }),
          // the content consists of a header and a list of items
          $(go.Panel, "Vertical",
            // this is the header for the whole node
            $(go.Panel, "Auto",
              { stretch: go.GraphObject.Horizontal },  // as wide as the whole node
              $(go.Shape,
                { fill: "#1570A6", stroke: null }),
              $(go.TextBlock,
                {
                  alignment: go.Spot.Center,
                  margin: 3,
                  stroke: "white",
                  textAlign: "center",
                  font: "bold 12pt sans-serif"
                },
                new go.Binding("text", "key"))),
            // this Panel holds a Panel for each item object in the itemArray;
            // each item Panel is defined by the itemTemplate to be a TableRow in this Table
            $(go.Panel, "Table",
              {
                padding: 2,
                minSize: new go.Size(100, 10),
                defaultStretch: go.GraphObject.Horizontal,
                itemTemplate: fieldTemplate
              },
              new go.Binding("itemArray", "fields")
            )  // end Table Panel of items
          )  // end Vertical Panel
        );  // end Node

      myRelate.linkTemplate =
        $(go.Link,
          {
            relinkableFrom: true, relinkableTo: true, // let user reconnect links
            toShortLength: 4,  fromShortLength: 2
          },
          $(go.Shape, { strokeWidth: 1.5 }),
          $(go.Shape, { toArrow: "Standard", stroke: null })
        );

      

      showModel();  // show the diagram's initial model

      function showModel() {
        document.getElementById("mySavedModel").textContent = myDiagram.model.toJson();
      }
}

function showJsonModal(html) {
  jsonModal
  $("#jsonModal .modal-body").html(html)
  $('.json').Tabledit({
    url: window.location.href,
                removeButton: false,
                columns: {
                    identifier: [0, 'id'],
                    editable: [[1, 'Name']  ]
                },
                onSuccess: (data, textStatus, jqXHR) => {
                    console.log(data, textStatus, jqXHR)
                }

            });
    $("#jsonModal").modal('show');
}

function saveJson(input) {

  let key = $(input).attr('data-key')
  let parent = $(input).parents('#jsonModal')

}
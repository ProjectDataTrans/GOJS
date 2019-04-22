function initRelate() {
    if (window.goSamples) {
        goSamples();
    }  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // fo
    myRelate =
        $(go.Diagram, "myRelationDiv",
            {
                validCycle: go.Diagram.CycleNotDirected,  // don't allow loops
                // For this sample, automatically show the state of the
                // diagram's model on the page
                "ModelChanged": function (e) {
                    if (e.isTransactionFinished) {
                        showModel();
                    }
                },
                "undoManager.isEnabled": true
            });

    myRelate.addDiagramListener("ObjectDoubleClicked", function (ev) {
        let data = ev.subject.part.data;
        let key = data.key;
        let fields = data.fields;
        let html = `
          <table id="table-json" class="json table-bordered table-hover" name="${key}">
          <thead>
              <tr>
                <th>Name</th>
                <th>Option</th>
              </tr>
          </thead>
          `
        let i = -1;
        for (let field of fields) {
            i++;
            html += `<tr row_id="${i}">
            <td ><div class="row_data" edit_type="click" col_name="name">${field.name}</div></td>
            <td >
                <span class="btn_edit" > <a href="#" class="btn btn-link " row_id="${i}" > Edit</a> </span>
                <span class="btn_save"> <a href="#" class="btn btn-link"  row_id="${i}"> Save</a> | </span>
                <span class="btn_cancel"> <a href="#" class="btn btn-link" row_id="${i}"> Cancel</a> | </span>
            </td>
            </tr>`
        }
        `</table>`
        showJsonModal(html)
    });
    // This template is a Panel that is used to represent each item in a
    // Panel.itemArray. The Panel is data bound to the item object.
    var fieldTemplate =
        $(go.Panel, "TableRow",  // this Panel is a row in the containing Table
            new go.Binding("portId", "name"),  // this Panel is a "port"
            {
                background: "transparent",  // so this port's background can be
                                            // picked by the mouse
                fromSpot: go.Spot.Right,  // links only go from the right side
                                          // to the left side
                toSpot: go.Spot.Left,
                // allow drawing links from or to this port:
                fromLinkable: true, toLinkable: true
            },
            $(go.Shape,
                {
                    width: 12, height: 12, column: 0, strokeWidth: 2, margin: 4,
                    // but disallow drawing links from or to this shape:
                    fromLinkable: false, toLinkable: false
                },
                new go.Binding("figure", "figure"),
                new go.Binding("fill", "color")),
            $(go.TextBlock,
                {
                    margin: new go.Margin(0, 5),
                    column: 1,
                    font: "bold 13px sans-serif",
                    alignment: go.Spot.Left,
                    // and disallow drawing links from or to this text:
                    fromLinkable: false,
                    toLinkable: false
                },
                new go.Binding("text", "name")),
            $(go.TextBlock,
                {
                    margin: new go.Margin(0, 5),
                    column: 2,
                    font: "13px sans-serif",
                    alignment: go.Spot.Left
                },
                new go.Binding("text", "info"))
        );

    // This template represents a whole "record".
    myRelate.nodeTemplate =
        $(go.Node, "Auto",
            {copyable: false, deletable: false},
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            // this rectangular shape surrounds the content of the node
            $(go.Shape,
                {fill: "#EEEEEE"}),
            // the content consists of a header and a list of items
            $(go.Panel, "Vertical",
                // this is the header for the whole node
                $(go.Panel, "Auto",
                    {stretch: go.GraphObject.Horizontal},  // as wide as the
                                                           // whole node
                    $(go.Shape,
                        {fill: "#1570A6", stroke: null}),
                    $(go.TextBlock,
                        {
                            alignment: go.Spot.Center,
                            margin: 3,
                            stroke: "white",
                            textAlign: "center",
                            font: "bold 12pt sans-serif"
                        },
                        new go.Binding("text", "key"))),
                // this Panel holds a Panel for each item object in the
                // itemArray; each item Panel is defined by the itemTemplate to
                // be a TableRow in this Table
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
        myRelate.model = go.Model.fromJson(JSON.parse(Cookies.get('modelJson')));
    myRelate.linkTemplate =
        $(go.Link,
            {
                relinkableFrom: true, relinkableTo: true, // let user reconnect
                                                          // links
                toShortLength: 4, fromShortLength: 2
            },
            $(go.Shape, {strokeWidth: 1.5}),
            $(go.Shape, {toArrow: "Standard", stroke: null})
        );

    showModel();  // show the diagram's initial model

    function showModel() {
        document.getElementById("mySavedModel").textContent = myDiagram.model.toJson();
    }

}

function showJsonModal(html) {
    $("#jsonModal .modal-body").html(html);
    $(document).find('.btn_save').hide();
    $(document).find('.btn_cancel').hide(); 
    // $('.json').Tabledit({
    //     url: window.location.href,
    //     removeButton: false,
    //     columns: {
    //         identifier: [0, 'id'],
    //         editable: [[1, 'Name']]
    //     },
    //     onSuccess: (data, textStatus, jqXHR) => {
    //         console.log(data, textStatus, jqXHR)
    //     }

    // });
    $("#jsonModal").modal('show');
}

function saveJson(input) {

    let key = $(input).attr('data-key');
    let parent = $(input).parents('#jsonModal');

}

//--->make div editable > start
$(document).on('click', '.row_data', function(event) 
{
    event.preventDefault(); 

    if($(this).attr('edit_type') == 'button')
    {
        return false; 
    }

    //make div editable
    $(this).closest('div').attr('contenteditable', 'true');
    //add bg css
    $(this).addClass('bg-warning').css('padding','5px');

    $(this).focus();
})  
//--->make div editable > end
//--->button > edit > start 
$(document).on('click', '.btn_edit', function(event) 
{
    event.preventDefault();
    var tbl_row = $(this).closest('tr');

    var row_id = tbl_row.attr('row_id');

    tbl_row.find('.btn_save').show();
    tbl_row.find('.btn_cancel').show();

    //hide edit button
    tbl_row.find('.btn_edit').hide(); 

    //make the whole row editable
    tbl_row.find('.row_data')
    .attr('contenteditable', 'true')
    .attr('edit_type', 'button')
    .addClass('bg-warning')
    .css('padding','3px')

    //--->add the original entry > start
    tbl_row.find('.row_data').each(function(index, val) 
    {  
        //this will help in case user decided to click on cancel button
        $(this).attr('original_entry', $(this).html());
    });         
    //--->add the original entry > end

});
//--->button > edit > end
 //--->button > cancel > start  
$(document).on('click', '.btn_cancel', function(event) 
{
    event.preventDefault();

    var tbl_row = $(this).closest('tr');

    var row_id = tbl_row.attr('row_id');

    //hide save and cacel buttons
    tbl_row.find('.btn_save').hide();
    tbl_row.find('.btn_cancel').hide();

    //show edit button
    tbl_row.find('.btn_edit').show();

    //make the whole row editable
    tbl_row.find('.row_data')
    .attr('edit_type', 'click')  
    .removeClass('bg-warning')
    .css('padding','') 

    tbl_row.find('.row_data').each(function(index, val) 
    {   
        $(this).html( $(this).attr('original_entry') ); 
    });  
});
//--->button > cancel > end
//--->save whole row entery > start 
$(document).on('click', '.btn_save', function(event) 
{
    event.preventDefault();
    var tbl_row = $(this).closest('tr');

    var row_id = tbl_row.attr('row_id');

    
    //hide save and cacel buttons
    tbl_row.find('.btn_save').hide();
    tbl_row.find('.btn_cancel').hide();

    //show edit button
    tbl_row.find('.btn_edit').show();


    //make the whole row editable
    tbl_row.find('.row_data')
    .attr('edit_type', 'click') 
    .removeClass('bg-warning')
    .css('padding','') 

    //--->get row data > start
    var arr = {}; 
    tbl_row.find('.row_data').each(function(index, val) 
    {   
        var col_name = $(this).attr('col_name');  
        var col_val  =  $(this).html();
        arr[col_name] = col_val;
    });
    //--->get row data > end

    //use the "arr" object for your ajax call
    $.extend(arr, {row_id:row_id});
    console.log(JSON.stringify(arr, null, 2))
    //out put to show
    $('.post_msg').html( '<pre class="bg-success">'+JSON.stringify(arr, null, 2) +'</pre>')
    var num = arr.row_id;
    var key = $("#table-json" ).attr("name");
    document.getElementById("table-json").value = myRelate.model.toJson();
    myRelate.isModified = false;
    let jsonData = myRelate.model.findNodeDataForKey(key);
    var store = jsonData.fields[num];
    store.rename = store.name;
    store.name = arr.name;
    myRelate.model = go.Model.fromJson(myRelate.model.toJson());



});
//--->save whole row entery > end
//--->save single field data > start
$(document).on('focusout', '.row_data', function(event) 
{
    event.preventDefault();

    if($(this).attr('edit_type') == 'button')
    {
        return false; 
    }

    var row_id = $(this).closest('tr').attr('row_id'); 
    
    var row_div = $(this)           
    .removeClass('bg-warning') //add bg css
    .css('padding','')

    var col_name = row_div.attr('col_name'); 
    var col_val = row_div.html(); 

    var arr = {};
    arr[col_name] = col_val;

    //use the "arr" object for your ajax call
    $.extend(arr, {row_id:row_id});

    //out put to show
    $('.post_msg').html( '<pre class="bg-success">'+JSON.stringify(arr, null, 2) +'</pre>');
    var num = arr.row_id;
    var key = $("#table-json" ).attr("name");
    document.getElementById("table-json").value = myRelate.model.toJson();
    myRelate.isModified = false;
    let jsonData = myRelate.model.findNodeDataForKey(key);
    var store = jsonData.fields[num];
    store.rename = store.name;
    store.name = arr.name;
    myRelate.model = go.Model.fromJson(myRelate.model.toJson());
     
    
})  
//--->save single field data > end
    function updateJson(input){
        document.getElementById("table-json").value = myRelate.model.toJson();
        download(myRelate.model.toJson(), "loadingData.json", "text/plain")
        myRelate.isModified = false;

    }


    // $('<button id="SaveButton" onclick="updateJson()">SaveJson</button>').appendTo('#container');


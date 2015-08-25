$scope.b=function(){
  console.log('dfghjkl;');
}
$scope.btnShow=function(data){
      console.log(data+'ghjkl;');
        var fileName = data;
        $("#btnShow").click(function () {
            $("#dialog").dialog({
                modal: true,
                title: fileName,
                width: 540,
                height: 450,
                buttons: {
                    Close: function () {
                        $(this).dialog('close');
                    }
                },
                open: function () {
                    var object = "<object data=\"{FileName}\" type=\"application/pdf\" width=\"500px\" height=\"300px\">";
                    object += "If you are unable to view file, you can download from <a href = \"{FileName}\">here</a>";
                    object += " or download <a target = \"_blank\" href = \"http://get.adobe.com/reader/\">Adobe PDF Reader</a> to view the file.";
                    object += "</object>";
                    object = object.replace(/{FileName}/g, "Files/" + fileName);
                    $("#dialog").html(object);
                }
            });
        });
  
    }



    <button ng-click="b()"></button>

<!-- 
<button ng-click="btnShow({{user_details.eng_pdf[0].file_name}})" />Show PDF</button>
<div id="dialog" style="display: none">
</div> -->
<!-- 
 <button type="submit" my-Modal="" class="cta main right ease" ng-click="openWindow()">open window</button> -->
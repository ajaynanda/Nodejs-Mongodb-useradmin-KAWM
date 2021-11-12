//data updating usiing ajax
$("#updateuser").submit(function (event) {
  event.preventDefault();
  var unindexed_array = $("#updateuser").serializeArray();
  var data = {};
  $.map(unindexed_array, (n, i) => {
    data[n["name"]] = n["value"];
  });

  var request = {
    url: `http://localhost:4000/updateuser/${data.id}`,
    method: "PUT",
    data: data,
  };

  $.ajax(request).done(function (response) {
  
    alert("updated the data");
  });
});

//updating userenquiry
$("#updatenquiry").submit(function (event) {
  event.preventDefault();
  var unindexed_array = $(this).serializeArray();

  var datas = {};

  $.map(unindexed_array, (n, i) => {
    datas[n["name"]] = n["value"];
  });
  console.log(datas);
  var requests = {
    url: `http://localhost:4000/updatnquiry/${datas.id}`,
    method: "PUT",
    data: datas,
  };
  $.ajax(requests).done(function (response) {
    alert("user enquiry updated ");
  });
});

var state = false;
function toggle() {
  if (state) {
    document.getElementById("password").setAttribute("type", "password");
    state = false;
    document.getElementById("eye").style.color = "dark grey";
  } else {
    document.getElementById("password").setAttribute("type", "text");
    state = true;
    document.getElementById("eye").style.color = "grey";
  }
}
//cpassword
var state = false;
function toggles() {
  if (state) {
    document.getElementById("cpassword").setAttribute("type", "password");
    state = false;
    document.getElementById("eyes").style.color = "dark grey";
  } else {
    document.getElementById("cpassword").setAttribute("type", "text");
    state = true;
    document.getElementById("eyes").style.color = "grey";
  }
}
// autocomplete searchuser

$(function () {
  $("#searchuser").autocomplete({
    source: function (req, res) {
      $.ajax({
        url: "autocompleted/",
        dataType: "jsonp",
        type: "GET",
        data: req,
        success: function (datas) {
          res(datas)
        
         },
        error: function (err) {
          console.log(err.status);
        },
      });
    },
  });
});

$(function () {
  $("#search").autocomplete({
    source: function (req, res) {
      $.ajax({
        url: "autosearched/",
        dataType: "jsonp",
        type: "GET",
        data: req,
        success: function (data) {
          res(data);
        
        },
        error: function (err) {
          console.log(err.status);
        },
      });
    }
  });
});

$(function () {
  $("#searchproduct").autocomplete({
    source: function (req, res) {
      $.ajax({
        url: "autocomplete/",
        dataType: "jsonp",
        type: "GET",
        data: req,
        success: function (data) {
          res(data);
        },
        error: function (err) {
          console.log(err.status);
        },
      });
    },
   
  });
});

function closeform() {
  document.getElementById("myForm").style.display = "none";
}

$("#updatestatus").submit(function (event) {
  event.preventDefault();
  var unindexed_array = $(this).serializeArray();

  var datas = {};

  $.map(unindexed_array, (n, i) => {
    datas[n["name"]] = n["value"];
  });

  var request = {
    url: `http://localhost:4000/updatstatus/${datas.id}`,
    method: "PUT",
    data: datas,
  };

  $.ajax(request).done(function (response) {
    console.log("updated");
  });
  alert("User Enquiry Status Updated");
});

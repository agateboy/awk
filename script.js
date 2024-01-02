// function saveToCSV() {
//   var csvContent = "";

//   // Ambil semua tabel
//   var tables = document.querySelectorAll("table");

//   tables.forEach(function (table) {
//     // Ambil semua baris dalam tbody
//     var rows = table.querySelectorAll("tbody tr");

//     rows.forEach(function (row) {
//       var rowData = [];

//       // Ambil semua sel dalam baris
//       var cells = row.querySelectorAll("td");

//       cells.forEach(function (cell) {
//         rowData.push(cell.textContent);
//       });

//       // Gabungkan data menjadi baris CSV
//       csvContent += rowData.join(",") + "\n";
//     });
//   });

//   // Buat objek Blob dan tautan unduhan
//   var blob = new Blob([csvContent], { type: "text/csv" });
//   var url = URL.createObjectURL(blob);

//   // Tautan unduhan
//   var a = document.createElement("a");
//   a.href = url;
//   a.download = "table_data.csv";
//   document.body.appendChild(a);
//   a.click();

//   // Hapus tautan setelah diunduh
//   document.body.removeChild(a);
// }
function saveToCSV() {
  var csvContent = "";
  var totalRisk = 0; // Variabel untuk menyimpan total risiko

  // Ambil semua tabel
  var tables = document.querySelectorAll("table");

  tables.forEach(function (table) {
    // Ambil semua baris dalam tbody
    var rows = table.querySelectorAll("tbody tr");

    // Ambil header dari th dalam thead
    var headerRow = table.querySelector("thead tr");
    var headerData = [];

    // Ambil semua sel dalam header
    var headerCells = headerRow.querySelectorAll("th");

    headerCells.forEach(function (headerCell) {
      headerData.push(headerCell.textContent);
    });

    // Tambahkan kolom "Total Risk" ke header
    headerData.push("Total Risk");

    // Gabungkan header menjadi baris CSV hanya pada baris pertama
    if (csvContent === "") {
      csvContent += headerData.join(",") + "\n";
    }

    rows.forEach(function (row) {
      var rowData = [];

      // Ambil semua sel dalam baris
      var cells = row.querySelectorAll("td");

      cells.forEach(function (cell, index) {
        rowData.push(cell.textContent);

        // Jika sel merupakan kolom "risk", tambahkan nilai ke totalRisk
        if (headerData[index] === "risk") {
          totalRisk += parseFloat(cell.textContent) || 0;
        }
      });

      // Tambahkan nilai total risiko ke baris CSV
      rowData.push(totalRisk);
      totalRisk = 0; // Reset totalRisk untuk baris berikutnya

      // Gabungkan data menjadi baris CSV
      csvContent += rowData.join(",") + "\n";
    });
  });

  // Buat objek Blob dan tautan unduhan
  var blob = new Blob([csvContent], { type: "text/csv" });
  var url = URL.createObjectURL(blob);

  // Tautan unduhan
  var a = document.createElement("a");
  a.href = url;
  a.download = "table_data.csv";
  document.body.appendChild(a);
  a.click();

  // Hapus tautan setelah diunduh
  document.body.removeChild(a);
}

// function updateTable(
//   counter,
//   minute,
//   highestHigh,
//   lowestLow,
//   trend,
//   setup,
//   order,
//   entry,
//   stoploss,
//   hasilpip,
//   closesetup,
//   closeprice,
//   closepip,
//   risk
// ) {
//   var table = document.getElementById("tabel");

//   // Jika belum ada tabel, buat tabel baru
//   if (!table.querySelector("table")) {
//     var newTable = document.createElement("table");
//     newTable.innerHTML = `
//           <thead>
//             <tr>
//               <th>Counter</th>
//               <th>Date</th>
//               <th>High</th>
//               <th>Low</th>
//               <th>Trend</th>
//               <th>Setup</th>
//               <th>Order</th>
//               <th>Entry</th>
//               <th>Stoploss</th>
//               <th>pip</th>
//               <th>Close Setup</th>
//               <th>Close Price</th>
//               <th>Close Pip</th>
//               <th>Risk</th>
//             </tr>
//           </thead>
//           <tbody></tbody>
//         `;
//     table.appendChild(newTable);
//   }

//   // Ambil referensi tbody
//   var tbody = table.querySelector("tbody");

//   // Buat atau update baris sesuai dengan counter
//   var row = tbody.querySelector(`tr[data-counter="${counter}"]`);
//   if (!row) {
//     // Jika baris belum ada, buat baris baru
//     row = document.createElement("tr");
//     row.setAttribute("data-counter", counter);
//     tbody.appendChild(row);
//   }

//   // Perbarui atau tambahkan nilai ke kolom-kolom tabel
//   row.innerHTML = `
//         <td>${counter}</td>
//         <td>${minute}</td>
//         <td>${highestHigh}</td>
//         <td>${lowestLow}</td>
//         <td>${trend}</td>
//         <td>${setup}</td>
//         <td>${order}</td>
//         <td>${entry}</td>
//         <td>${stoploss}</td>
//         <td>${hasilpip}</td>
//         <td>${closesetup}</td>
//         <td>${closeprice}</td>
//         <td>${closepip}</td>
//         <td>${risk}%</td>
//       `;
// }
var tablecounter = 1; // Variable untuk menyimpan nilai counter tabel

function updateTable(
  counter,
  minute,
  highestHigh,
  lowestLow,
  trend,
  setup,
  order,
  entry,
  stoploss,
  hasilpip,
  closesetup,
  closeprice,
  closepip,
  risk,
  equity
) {
  console.log("tabless");
  var tableId = "tabel" + tablecounter;
  var table = document.getElementById(tableId);

  // Jika belum ada tabel, buat tabel baru
  if (!table) {
    var newTable = document.createElement("table");
    newTable.innerHTML = `
          <thead>
            <tr>
              <th>Counter</th>
              <th>Date</th>
              <th>High</th>
              <th>Low</th>
              <th>Trend</th>
              <th>Setup</th>
              <th>Order</th>
              <th>Entry</th>
              <th>Stoploss</th>
              <th>pip</th>
              <th>Close Setup</th>
              <th>Close Price</th>
              <th>Close Pip</th>
              <th>Risk</th>
              <th>Equity</th>
            </tr>
          </thead>
          <tbody></tbody>
        `;
    newTable.setAttribute("id", tableId);
    document.getElementById("tabel").appendChild(newTable);
  }

  // Ambil referensi tbody
  var tbody = document.getElementById(tableId).querySelector("tbody");

  // Buat atau update baris sesuai dengan counter
  var row = tbody.querySelector(`tr[data-counter="${counter}"]`);
  if (!row) {
    // Jika baris belum ada, buat baris baru
    row = document.createElement("tr");
    row.setAttribute("data-counter", counter);
    tbody.appendChild(row);
  }

  // Perbarui atau tambahkan nilai ke kolom-kolom tabel
  row.innerHTML = `
        <td>${counter}</td>
        <td>${minute}</td>
        <td>${highestHigh}</td>
        <td>${lowestLow}</td>
        <td>${trend}</td>
        <td>${setup}</td>
        <td>${order}</td>
        <td>${entry}</td>
        <td>${stoploss}</td>
        <td>${hasilpip}</td>
        <td>${closesetup}</td>
        <td>${closeprice}</td>
        <td>${closepip}</td>
        <td>${risk}%</td>
        <td>${equity}</td>
      `;
}
async function loadCSV() {
  const response = await fetch("2021f.csv"); // Replace with your CSV file path
  const text = await response.text();
  const rows = text.split("\n").map((row) => row.split(","));
  return rows;
}

// Function to check if a date exists in the CSV
async function checkCSVForDate(date, csvData) {
  return csvData.some((row) => {
    const csvDate = new Date(row[0]); // Assuming date is in the first column
    return date.getTime() === csvDate.getTime();
  });
}

async function dateLoop() {
  // Load CSV data into memory
  var csvData = await loadCSV();

  var inputStartDate = new Date(document.getElementById("start-date").value);
  var inputEndDate = new Date(document.getElementById("end-date").value);

  if (isNaN(inputStartDate)) {
    alert("Market Libur.");
    return;
  }

  var startToday = new Date(inputStartDate);
  var FinishDate = new Date(inputEndDate);

  while (startToday.getTime() <= FinishDate.getTime()) {
    console.log(startToday);

    // Check if startToday exists in the CSV
    if (!(await checkCSVForDate(startToday, csvData))) {
      startToday.setDate(startToday.getDate() + 3);
    }
    var keyPipInput = document.getElementById("keyPipInput");
    var keypip = keyPipInput.value;

    if (keypip.trim() === "") {
      keypip = 1.55;
    }
    var endToday = new Date(startToday);
    endToday.setHours(23, 59, 59, 999);
    startToday.setHours(1, 0, 0, 0);
    var startTomorrow = new Date(startToday);
    startTomorrow.setDate(startTomorrow.getDate() + 1);
    startTomorrow.setHours(1, 0, 0, 0);
    var endTomorrow = new Date(startTomorrow);
    endTomorrow.setHours(23, 59, 59, 999);

    // Check if startTomorrow exists in the CSV
    if (!(await checkCSVForDate(startTomorrow, csvData))) {
      startTomorrow.setDate(startToday.getDate() + 3);
    }

    var endTomorrow = new Date(startTomorrow);
    endTomorrow.setHours(23, 59, 59, 999);

    // Call your validateAndPlot function here
    validateAndPlot(startToday, startTomorrow, endToday, endTomorrow, keypip);

    await new Promise((resolve) => setTimeout(resolve, 4000));
    startToday = new Date(startTomorrow);
  }
}
var equity = 5000;

function validateAndPlot(
  startToday,
  startTomorrow,
  endToday,
  endTomorrow,
  keypip
) {
  document.getElementById("analisa").innerHTML = "";
  document.getElementById("simulasi").innerHTML = "";
  function addParagraphToAnalisa(text) {
    var analyzeDiv = document.getElementById("analisa");
    var paragraph = document.createElement("p");
    paragraph.textContent = text;
    analyzeDiv.appendChild(paragraph);
  }

  function simulasi(text) {
    var analyzeDiv = document.getElementById("simulasi");
    var paragraph = document.createElement("p");
    paragraph.textContent = text;
    analyzeDiv.appendChild(paragraph);
  }
  // Ambil data dari CSV
  Plotly.d3.csv("2021f.csv", function (data) {
    // Konversi tanggal ke format yang benar
    data.forEach(function (d) {
      d.Date = new Date(d.Date);
    });

    // Fungsi untuk memfilter data berdasarkan tanggal
    function filterDataByDate(data, startDate, endDate) {
      return data.filter(function (d) {
        return d.Date >= startDate && d.Date <= endDate;
      });
    }
    function findIndexByValue(data, value) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].Low === value || data[i].High === value) {
          return i;
        }
      }
      return -1;
    }
    // Filter data berdasarkan input pengguna untuk hari ini, besok, dan lusa
    var selectedData = filterDataByDate(data, startToday, endToday);
    var tomorrowData = filterDataByDate(data, startTomorrow, endTomorrow);

    // Fungsi untuk mengagregasi data per jam
    function aggregateDataHourly(data) {
      var aggregatedData = [];
      var currentHourData = null;

      data.forEach(function (d) {
        var hour = d.Date.getHours();

        if (!currentHourData || hour !== currentHourData.Date.getHours()) {
          if (currentHourData) {
            aggregatedData.push(currentHourData);
          }
          currentHourData = {
            Date: new Date(
              d.Date.getFullYear(),
              d.Date.getMonth(),
              d.Date.getDate(),
              hour,
              0,
              0
            ),
            Open: d.Open,
            High: d.High,
            Low: d.Low,
            Close: d.Close,
          };
        } else {
          // Update high, low, and close for the same hour
          currentHourData.High = Math.max(currentHourData.High, d.High);
          currentHourData.Low = Math.min(currentHourData.Low, d.Low);
          currentHourData.Close = d.Close;
        }
      });

      // Push the last hour's data
      if (currentHourData) {
        aggregatedData.push(currentHourData);
      }

      return aggregatedData;
    }

    // Agregasi data per menit untuk besok
    function aggregateDataMinute(data) {
      var aggregatedData = [];
      var currentMinuteData = null;

      data.forEach(function (d) {
        var minute = d.Date.getMinutes();

        if (
          !currentMinuteData ||
          minute !== currentMinuteData.Date.getMinutes()
        ) {
          if (currentMinuteData) {
            aggregatedData.push(currentMinuteData);
          }
          currentMinuteData = {
            Date: new Date(
              d.Date.getFullYear(),
              d.Date.getMonth(),
              d.Date.getDate(),
              d.Date.getHours(),
              minute,
              0
            ),
            Open: d.Open,
            High: d.High,
            Low: d.Low,
            Close: d.Close,
          };
        } else {
          // Update high, low, and close for the same minute
          currentMinuteData.High = Math.max(currentMinuteData.High, d.High);
          currentMinuteData.Low = Math.min(currentMinuteData.Low, d.Low);
          currentMinuteData.Close = d.Close;
        }
      });

      // Push the last minute's data
      if (currentMinuteData) {
        aggregatedData.push(currentMinuteData);
      }

      return aggregatedData;
    }

    var selectedAggregatedData = aggregateDataHourly(selectedData);
    var lowestLow = findLowest(selectedAggregatedData);
    var highestHigh = findHighest(selectedAggregatedData);
    var lowestLowIndex = findIndexByValue(selectedAggregatedData, lowestLow);
    var highestHighIndex = findIndexByValue(
      selectedAggregatedData,
      highestHigh
    );

    // Hitung level Fibonacci
    var fibonacciLevels = [0, 0.23, 0.38, 0.5, 0.61, 1];

    // Hitung nilai untuk setiap level
    var fibonacciValues = fibonacciLevels.map(function (level) {
      if (lowestLowIndex < highestHighIndex) {
        return highestHigh + level * (lowestLow - highestHigh);
      } else {
        return lowestLow + level * (highestHigh - lowestLow);
      }
    });
    var fibo0 = fibonacciValues[0];
    var fibo23 = fibonacciValues[1];
    var fibo38 = fibonacciValues[2];
    var fibo50 = fibonacciValues[3];
    var fibo61 = fibonacciValues[4];
    var fibo100 = fibonacciValues[5];
    // Create a paragraph element for each Fibonacci value and append it to the div
    for (var i = 0; i < fibonacciValues.length; i++) {
      addParagraphToAnalisa(`Fibo ${i}: ${fibonacciValues[i]}`);
    }
    var tomorrowsimulation = aggregateDataMinute(tomorrowData);
    // Console log data per menit untuk besok
    var uptrend = false;
    var downtrend = false;
    if (lowestLowIndex < highestHighIndex) {
      console.log("UPTREND");
      uptrend = true;
      addParagraphToAnalisa(`UPTREND`);
      // if (fibo61 <= first_next <= fibo23) {
      //   addParagraphToAnalisa(`OPEN A`);
      // } else if (fibo23 <= first_next <= fibo0) {
      //   addParagraphToAnalisa(`OPEN B`);
      // } else if (fibo100 <= first_next <= fibo61) {
      //   addParagraphToAnalisa(`OPEN C`);
      // }
    } else {
      console.log("DOWNTREND");
      addParagraphToAnalisa(`DOWNTREND`);
      downtrend = true;
      // if (fibo61 >= first_next >= fibo23) {
      //   addParagraphToAnalisa(`OPEN A`);
      //   console.log("OPEN A");
      // } else if (fibo23 >= first_next >= fibo0) {
      //   addParagraphToAnalisa(`OPEN B`);
      //   console.log("OPEN B");
      // } else if (fibo100 >= first_next >= fibo61) {
      //   addParagraphToAnalisa(`OPEN C`);
      //   console.log("OPEN C");
      // }
    }

    // Tampilkan nilai terendah, tertinggi, dan level Fibonacci pada console log
    console.log("Lowest Low:", lowestLow);
    console.log("Highest High:", highestHigh);
    // console.log(
    //   "Lowest Low Time:",
    //   selectedAggregatedData[lowestLowIndex].Date
    // );
    // console.log(
    //   "Highest High Time:",
    //   selectedAggregatedData[highestHighIndex].Date
    // );
    console.log("fibo0 : " + fibo0);
    console.log("fibo23 : " + fibo23);
    console.log("fibo38 : " + fibo38);
    console.log("fibo50 : " + fibo50);
    console.log("fibo61 : " + fibo61);
    console.log("fibo100 : " + fibo100);
    // Tentukan candlestick chart untuk hari ini, besok, dan lusa
    var selectedTrace = {
      x: selectedAggregatedData.map(function (d) {
        return d.Date;
      }),
      open: selectedAggregatedData.map(function (d) {
        return d.Open;
      }),
      high: selectedAggregatedData.map(function (d) {
        return d.High;
      }),
      low: selectedAggregatedData.map(function (d) {
        return d.Low;
      }),
      close: selectedAggregatedData.map(function (d) {
        return d.Close;
      }),
      type: "candlestick",
      xaxis: "x",
      yaxis: "y",
      name: "Today",
    };

    // Atur layout chart
    var layout = {
      xaxis: {
        type: "date",
        tickformat: "%Y-%m-%d %H:%M:%S",
        tickmode: "linear",
        tick0: startToday, // Set tick0 to the start date
        dtick: 3600000, // Set dtick to 1 hour in milliseconds
        rangeslider: { visible: false },
        autorange: true, // Autoscale x-axis
      },
      yaxis: {
        title: "Price",
        autorange: true, // Autoscale y-axis
      },
      shapes: fibonacciValues.map(function (value, index) {
        return {
          type: "line",
          xref: "paper",
          x0: 0,
          x1: 1,
          yref: "y",
          y0: value,
          y1: value,
          line: {
            color: "rgba(255,0,0,0.5)",
            width: 2,
            dash: "dashdot",
          },
        };
      }),
    };

    // Tampilkan chart untuk hari ini
    Plotly.newPlot("chart", [selectedTrace], layout);

    // Agregasi data per menit untuk besok
    var tomorrowAggregatedData = aggregateDataHourly(tomorrowData);

    // Tentukan candlestick chart untuk besok pada skala jam
    var tomorrowTrace = {
      x: tomorrowAggregatedData.map(function (d) {
        return d.Date;
      }),
      open: tomorrowAggregatedData.map(function (d) {
        return d.Open;
      }),
      high: tomorrowAggregatedData.map(function (d) {
        return d.High;
      }),
      low: tomorrowAggregatedData.map(function (d) {
        return d.Low;
      }),
      close: tomorrowAggregatedData.map(function (d) {
        return d.Close;
      }),
      type: "candlestick",
      xaxis: "x",
      yaxis: "y",
      name: "Tomorrow",
    };

    // Atur layout chart untuk besok pada skala jam
    var layoutTomorrow = {
      xaxis: {
        type: "date",
        tickformat: "%Y-%m-%d %H:%M:%S",
        tickmode: "linear",
        tick0: startTomorrow, // Set tick0 to the start date
        dtick: 3600000, // Set dtick to 1 hour in milliseconds
        rangeslider: { visible: false },
        autorange: true, // Autoscale x-axis
      },
      yaxis: {
        title: "Price",
        autorange: true, // Autoscale y-axis
      },
      shapes: fibonacciValues.map(function (value, index) {
        return {
          type: "line",
          xref: "paper",
          x0: 0,
          x1: 1,
          yref: "y",
          y0: value,
          y1: value,
          line: {
            color: "rgba(255,0,0,0.5)",
            width: 2,
            dash: "dashdot",
          },
        };
      }),
    };

    // Tampilkan chart untuk besok pada skala jam
    Plotly.newPlot("tomorrow", [tomorrowTrace], layoutTomorrow);
    var sellstop = 0;
    var buystop = 0;
    var sell_stop = false;
    var sell_limit = false;
    var sell_stop2 = false;
    var buy_stop2 = false;
    var loss = false;
    var buy_stop = false;
    var buy_limit = false;
    var cut_loss = false;
    var stop = false;
    var trail = 4;
    var counter = 0;
    var sphread = 0.5;
    var buy = false;
    var sell = false;
    var setopen = false;
    var tp1b = false;
    var tp2b = false;
    var tp3b = false;
    var tp4b = false;
    var tp5b = false;
    var tp6b = false;
    var tp7b = false;
    var tp1s = false;
    var tp2s = false;
    var tp3s = false;
    var tp4s = false;
    var tp5s = false;
    var tp6s = false;
    var tp7s = false;
    var b1a = 0;
    var b1b = 0;
    var b1c = 0;
    var b1d = 0;
    var b1tp = 0;
    var b1tp1 = 0;
    var b1tp2 = 0;
    var b1tp3 = 0;
    var b1tp4 = 0;
    var b1tp5 = 0;
    var b2a = 0;
    var b2b = 0;
    var b2c = 0;
    var b2d = 0;
    var b2tp = 0;
    var b2tp1 = 0;
    var b2tp2 = 0;
    var b2tp3 = 0;
    var b2tp4 = 0;
    var b2tp5 = 0;
    var a1a = 0;
    var a1atp = 0;
    var a1atp1 = 0;
    var a1atp2 = 0;
    var a1atp3 = 0;
    var a1atp4 = 0;
    var a1atp5 = 0;
    var a1b = 0;
    var a1btp = 0;
    var a1btp1 = 0;
    var a1btp2 = 0;
    var a1btp3 = 0;
    var a1btp4 = 0;
    var a1btp5 = 0;
    var a2a = 0;
    var a2atp = 0;
    var a2atp1 = 0;
    var a2atp2 = 0;
    var a2atp3 = 0;
    var a2atp4 = 0;
    var a2atp5 = 0;
    var a2atp5 = 0;
    var a2b = 0;
    var a2btp = 0;
    var a2btp1 = 0;
    var a2btp2 = 0;
    var a2btp3 = 0;
    var a2btp4 = 0;
    var a2btp5 = 0;
    var a2btp6 = 0;
    var c1a = 0;
    var c1b = 0;
    var c1c = 0;
    var c1d = 0;
    var c1tp = 0;
    var c1tp1 = 0;
    var c1tp2 = 0;
    var c1tp3 = 0;
    var c1tp4 = 0;
    var c1tp5 = 0;
    var c2a = 0;
    var c2b = 0;
    var c2c = 0;
    var c2d = 0;
    var c2tp = 0;
    var c2tp1 = 0;
    var c2tp2 = 0;
    var c2tp3 = 0;
    var c2tp4 = 0;
    var c2tp5 = 0;
    var tpbuy = false;
    var stop_loss = false;
    var stoploss = 0;
    var trail_stop = false;
    var trail_count = 0;
    var trailmode = false;
    var bep = false;
    var selisihbep = 0;
    var selisihts = 0;
    var tsbuy = 0;
    var tssell = 0;
    var tsbuy = 0;
    var enambelas = new Date();
    var hasil = 0;
    enambelas.setHours(16, 0, 0, 0);
    var sixteen = new Date();
    sixteen.setHours(18, 0, 0, 0);
    for (var i = 0; i < tomorrowsimulation.length; i++) {
      var minute = tomorrowsimulation[i].Date;
      var open_value = parseFloat(tomorrowsimulation[i].Open).toFixed(2);
      var low_value = parseFloat(tomorrowsimulation[i].Low).toFixed(2);
      var high_value = parseFloat(tomorrowsimulation[i].High).toFixed(2); // Fixed: changed to High instead of Low
      var first_next = parseFloat(tomorrowsimulation[0].Open).toFixed(2);
      console.log(
        `Minute: ${minute}, Open: ${open_value}, High: ${high_value}, Low: ${low_value}`
      );

      if (lowestLowIndex < highestHighIndex) {
        console.log("UPTREND");
        uptrend = true;
        var trend = "UP";
        // addParagraphToAnalisa(`UPTREND`);
        if (fibo61 <= first_next && first_next <= fibo23) {
          var setup = "A";
          // addParagraphToAnalisa(`OPEN A`);
          console.log("OPEN A");
          selisihbep = parseFloat(fibo0 - fibo23).toFixed(2);
          tssell = parseFloat(fibo100 - selisihbep).toFixed(2);
          a2a = parseFloat(fibo50 + keypip + sphread).toFixed(2);
          a2atp = fibo0 - keypip;
          a2atp1 = a2atp + trail;
          a2atp2 = a2atp1 + trail;
          a2atp3 = a2atp2 + trail;
          a2atp4 = a2atp3 + trail;
          a2atp5 = a2atp4 + trail;
          a2atp6 = a2atp5 + trail;
          a2b = parseFloat(fibo50 - keypip).toFixed(2);
          a2btp = fibo100 + keypip + sphread;
          a2btp1 = a2btp - trail;
          a2btp2 = a2btp1 - trail;
          a2btp3 = a2btp2 - trail;
          a2btp4 = a2btp3 - trail;
          a2btp5 = a2btp4 - trail;
          a2btp6 = a2btp5 - trail;
          tsbuy = fibo0 - selisihbep;
          console.log(`a2a : ${a2a}`);
          console.log(`a2b : ${a2b}`);
          if (!stop_loss) {
            if (
              (open_value <= stoploss ||
                low_value <= stoploss ||
                high_value <= stoploss) &&
              buy
            ) {
              buy = false;
              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Trail Stop";
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  buy_stop = true;
                  sell_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                  var closesetup = "Stop Loss";
                } else if (
                  bep &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = false;
                  bep = false;
                  var hasil = 0;
                  var closesetup = "BEP";
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Trail Stop";
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }

              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                counter,
                minute,
                highestHigh,
                lowestLow,
                trend,
                setup,
                order,
                entry,
                stoploss,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,
                equity
              );
            }
            if (
              (open_value >= stoploss ||
                low_value >= stoploss ||
                high_value >= stoploss) &&
              sell
            ) {
              sell = false;
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(sellstop - stoploss);
                  simulasi(hasil);
                  var closesetup = "Trail Stop";
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  buy_stop = true;
                  sell_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                  var closesetup = "Stop Loss";
                } else if (
                  bep &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = true;
                  bep = false;
                  var hasil = 0;
                  var closesetup = "BEP";
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Trail Stop";
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss}`);
                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Trail Stop";
              }
              var closeprice = parseFloat(stoploss).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }

              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                counter,
                minute,
                highestHigh,
                lowestLow,
                trend,
                setup,
                order,
                entry,
                stoploss,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,
                equity
              );
            }
          }
          if (
            (a2a >= open_value && open_value >= a2b) ||
            (a2a >= high_value && high_value >= a2b) ||
            (a2a >= low_value && low_value >= a2b)
          ) {
            if (!setopen) {
              sellstop = a2b;
              console.log(`SELL STOP : ${sellstop}`);
              simulasi(`SELL STOP : ${sellstop}`);
              sell_stop = true;
              buystop = a2a;
              console.log(`BUY STOP : ${buystop}`);
              simulasi(`BUY STOP : ${buystop}`);
              buy_stop = true;
              setopen = true;
            } else if (setopen) {
              if (open_value <= a2b || low_value <= a2b || high_value <= a2b) {
                if (counter >= 4) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (minute.getHours() >= enambelas.getHours()) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (sell_stop && !sell) {
                  stop_loss = false;
                  var order = "Sell Stop";
                  var entry = sellstop;
                  console.log(`SELL STOP AT : ${sellstop}`);
                  simulasi(`SELL STOP AT : ${sellstop} in ${minute}`);
                  sell = true;
                  buy = false;
                  counter = counter + 1;
                  buy_stop = true;
                  buystop = a2a;
                  stoploss = buystop;
                  sell_stop = false;
                  var hasilpip = parseFloat(stoploss - entry).toFixed(2);
                }
              } else if (
                open_value >= a2a ||
                low_value >= a2a ||
                high_value >= a2a
              ) {
                if (counter >= 4) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (minute.getHours() >= enambelas.getHours()) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (buy_stop && !buy) {
                  stop_loss = false;
                  var order = "Buy Stop";
                  var entry = buystop;
                  console.log(`BUY STOP AT : ${buystop}`);
                  simulasi(`BUY STOP AT : ${buystop} in ${minute}`);
                  buy = true;
                  sell = false;
                  counter = counter + 1;
                  buy_stop = false;
                  sellstop = a2b;
                  stoploss = sellstop;
                  sell_stop = true;
                  var hasilpip = parseFloat(entry - stoploss).toFixed(2);
                }
              }
              if (buy) {
                if (
                  open_value >= tsbuy ||
                  low_value >= tsbuy ||
                  high_value >= tsbuy
                ) {
                  if (
                    open_value >= a2atp6 ||
                    low_value >= a2atp6 ||
                    high_value >= a2atp6
                  ) {
                    tp7b = true;
                  } else if (
                    open_value >= a2atp5 ||
                    low_value >= a2atp5 ||
                    high_value >= a2atp5
                  ) {
                    tp6b = true;
                  } else if (
                    open_value >= a2atp4 ||
                    low_value >= a2atp4 ||
                    high_value >= a2atp4
                  ) {
                    tp5b = true;
                  } else if (
                    open_value >= a2atp3 ||
                    low_value >= a2atp3 ||
                    high_value >= a2atp3
                  ) {
                    tp4b = true;
                  } else if (
                    open_value >= a2atp2 ||
                    low_value >= a2atp2 ||
                    high_value >= a2atp2
                  ) {
                    tp3b = true;
                  } else if (
                    open_value >= a2atp1 ||
                    low_value >= a2atp1 ||
                    high_value >= a2atp1
                  ) {
                    tp2b = true;
                  } else if (
                    open_value >= a2atp ||
                    low_value >= a2atp ||
                    high_value >= a2atp
                  ) {
                    tp1b = true;
                  }
                  if (tp7b) {
                    stoploss = a2atp5;
                  } else if (tp6b) {
                    stoploss = a2atp4;
                  } else if (tp5b) {
                    stoploss = a2atp3;
                  } else if (tp4b) {
                    stoploss = a2atp2;
                  } else if (tp3b) {
                    stoploss = a2atp1;
                  } else if (tp2b) {
                    stoploss = a2atp;
                  } else if (tp1b) {
                    stoploss = a2atp;
                  }
                }
                if (
                  (open_value >= fibo0 ||
                    low_value >= fibo0 ||
                    high_value >= fibo0) &&
                  !bep
                ) {
                  bep = true;
                  stoploss = buystop;
                }
              } else if (sell) {
                if (
                  open_value <= tssell ||
                  low_value <= tssell ||
                  high_value <= tssell
                ) {
                  if (
                    open_value <= a2btp6 ||
                    low_value <= a2atp6 ||
                    high_value <= a2atp6
                  ) {
                    tp7s = true;
                  } else if (
                    open_value <= a2btp5 ||
                    low_value <= a2atp5 ||
                    high_value <= a2atp5
                  ) {
                    tp6s = true;
                  } else if (
                    open_value <= a2btp4 ||
                    low_value <= a2atp4 ||
                    high_value <= a2atp4
                  ) {
                    tp5s = true;
                  } else if (
                    open_value <= a2btp3 ||
                    low_value <= a2atp3 ||
                    high_value <= a2atp3
                  ) {
                    tp4s = true;
                  } else if (
                    open_value <= a2btp2 ||
                    low_value <= a2atp2 ||
                    high_value <= a2atp2
                  ) {
                    tp3s = true;
                  } else if (
                    open_value <= a2btp1 ||
                    low_value <= a2atp1 ||
                    high_value <= a2atp1
                  ) {
                    tp2s = true;
                  } else if (
                    open_value <= a2btp ||
                    low_value <= a2atp ||
                    high_value <= a2atp
                  ) {
                    tp1s = true;
                  }
                  if (tp7s) {
                    stoploss = a2btp5;
                  } else if (tp6s) {
                    stoploss = a2btp4;
                  } else if (tp5s) {
                    stoploss = a2btp3;
                  } else if (tp4s) {
                    stoploss = a2btp2;
                  } else if (tp3s) {
                    stoploss = a2btp1;
                  } else if (tp2s) {
                    stoploss = a2btp;
                  } else if (tp1s) {
                    stoploss = a2btp;
                  }
                }
                if (
                  (open_value <= fibo100 ||
                    low_value <= fibo100 ||
                    high_value <= fibo100) &&
                  !bep
                ) {
                  bep = true;
                  stoploss = sellstop;
                }
              }
            }
          }
          if (minute.getHours() >= enambelas.getHours()) {
            sell_stop = false;
            buy_stop = false;
          }
          if (minute.getHours() >= sixteen.getHours()) {
            simulasi(`OPEN : ${open_value}`);
            simulasi(counter);
            simulasi(`buy ${buystop}`);
            simulasi(`sell ${sellstop}`);
            simulasi(bep);
            if (buy) {
              hasil = parseFloat(open_value - entry).toFixed(2);

              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              // break;
            } else if (sell) {
              hasil = parseFloat(entry - open_value).toFixed(2);

              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              // break;
            }
            if (hasilpip !== 0) {
              risk = parseFloat(closepip / hasilpip).toFixed(2);
            } else {
              risk = 0; // or any other default value you want when hasilpip is 0
            }
            equity = parseFloat(equity * (risk / 100) + equity);
            updateTable(
              counter,
              minute,
              highestHigh,
              lowestLow,
              trend,
              setup,
              order,
              entry,
              stoploss,
              hasilpip,
              closesetup,
              closeprice,
              closepip,
              risk,
              equity
            );
            break;
          }
        } else if (fibo23 <= first_next && first_next <= fibo0) {
          var setup = "B";
          selisihbep = parseFloat((fibo61 - fibo100).toFixed(2));
          b2a = (fibo0 + fibo23) / 2 - keypip;
          b2b = fibo0 - keypip;
          b2c = parseFloat(fibo23 - keypip).toFixed(2);
          b2d = fibo0 + keypip + sphread;
          b2tp = fibo100 + keypip + sphread;
          b2tp1 = b2tp - trail;
          b2tp2 = b2tp1 - trail;
          b2tp3 = b2tp2 - trail;
          b2tp4 = b2tp3 - trail;
          b2tp5 = b2tp4 - trail;
          b2tp6 = b2tp5 - trail;
          ts = parseFloat((tsbuy - keypip).toFixed(2));
          ts1 = ts + 4;
          ts2 = ts1 + 4;
          ts3 = ts2 + 4;
          ts4 = ts3 + 4;
          ts5 = ts4 + 4;
          ts6 = ts5 + 4;
          selisihts = parseFloat((b2c - fibo100).toFixed(2));
          tsbuy = parseFloat((b2d + selisihts).toFixed(2));
          bepbuy = parseFloat((tsbuy - selisihbep).toFixed(2));
          if (!stop_loss) {
            if (
              (open_value <= stoploss ||
                low_value <= stoploss ||
                high_value <= stoploss) &&
              buy
            ) {
              buy = false;
              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Trail Stop";
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  buy_stop = true;
                  sell_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                  var closesetup = "Stop Loss";
                } else if (
                  bep &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = false;
                  bep = false;
                  var closesetup = "BEP";
                  var hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Trail Stop";
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }

              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                counter,
                minute,
                highestHigh,
                lowestLow,
                trend,
                setup,
                order,
                entry,
                stoploss,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,
                equity
              );
            } else if (
              (open_value >= stoploss ||
                low_value >= stoploss ||
                high_value >= stoploss) &&
              sell
            ) {
              sell = false;
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(sellstop - stoploss);
                  simulasi(hasil);
                  var closesetup = "Trail Stop";
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  buy_stop = true;
                  sell_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                  var closesetup = "Stop Loss";
                } else if (
                  bep &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = true;
                  bep = false;
                  var closesetup = "BEP";
                  var hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Trail Stop";
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss}`);
                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }

              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                counter,
                minute,
                highestHigh,
                lowestLow,
                trend,
                setup,
                order,
                entry,
                stoploss,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,
                equity
              );
            }
          }

          if (b2d >= open_value && open_value >= b2c) {
            if (!setopen) {
              sellstop = b2c;
              simulasi(`SELL STOP : ${sellstop}`);
              sell_stop = true;
              buystop = b2d;
              simulasi(`BUY STOP : ${buystop}`);
              buy_stop = true;
              setopen = true;
            } else if (setopen) {
              if (
                open_value <= sellstop ||
                low_value <= sellstop ||
                high_value <= sellstop
              ) {
                if (counter >= 4) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (minute.getHours() >= enambelas.getHours()) {
                  sell_stop = false;
                  buy_stop = false;
                } else if (sell_stop && !sell) {
                  stop_loss = false;
                  var order = "Sell Stop";
                  var entry = sellstop;
                  simulasi(`SELL STOP AT: ${sellstop} in ${minute}`);
                  sell = true;
                  buy = false;
                  counter = counter + 1;
                  buy_stop = true;
                  sell_stop = false;
                  stoploss = buystop;
                  bep = false;
                  var hasilpip = parseFloat(stoploss - entry).toFixed(2);
                }
              } else if (
                open_value >= buystop ||
                low_value >= buystop ||
                high_value >= buystop
              ) {
                if (counter >= 4) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (
                  minute.getHours() >= enambelas.getHours() &&
                  (!buy_stop || !sell1)
                ) {
                  sell_stop = false;
                  buy_stop = false;
                } else if (buy_stop && !buy) {
                  stop_loss = false;
                  var order = "Buy Stop";
                  var entry = buystop;
                  simulasi(`BUY STOP AT: ${buystop} in ${minute}`);
                  sell = false;
                  buy = true;
                  counter = counter + 1;
                  sell_stop = true;
                  buy_stop = false;
                  stoploss = sellstop;
                  bep = false;
                  var hasilpip = parseFloat(entry - stoploss).toFixed(2);
                }
              }
            }
          }
          if (sell) {
            if (
              open_value <= fibo100 ||
              low_value <= fibo100 ||
              high_value <= fibo100
            ) {
              if (
                open_value <= b2tp6 ||
                low_value <= b2tp6 ||
                high_value <= b2tp6
              ) {
                tp7s = true;
              } else if (
                open_value <= b2tp5 ||
                low_value <= b2tp5 ||
                high_value <= b2tp5
              ) {
                tp6s = true;
              } else if (
                open_value <= b2tp4 ||
                low_value <= b2tp4 ||
                high_value <= b2tp4
              ) {
                tp5s = true;
              } else if (
                open_value <= b2tp3 ||
                low_value <= b2tp3 ||
                high_value <= b2tp3
              ) {
                tp4s = true;
              } else if (
                open_value <= b2tp2 ||
                low_value <= b2tp2 ||
                high_value <= b2tp2
              ) {
                tp3s = true;
              } else if (
                open_value <= b2tp1 ||
                low_value <= b2tp1 ||
                high_value <= b2tp1
              ) {
                tp2s = true;
              } else if (
                open_value <= b2tp ||
                low_value <= b2tp ||
                high_value <= b2tp
              ) {
                tp1s = true;
              }
              if (tp7s) {
                stoploss = b2tp5;
              } else if (tp6s) {
                stoploss = b2tp4;
              } else if (tp5s) {
                stoploss = b2tp3;
              } else if (tp4s) {
                stoploss = b2tp2;
              } else if (tp3s) {
                stoploss = b2tp1;
              } else if (tp2s) {
                stoploss = b2tp;
              } else if (tp1s) {
                stoploss = b2tp;
              }
            } else if (
              (open_value <= fibo61 ||
                low_value <= fibo61 ||
                high_value <= fibo61) &&
              !bep
            ) {
              bep = true;
              stoploss = sellstop;
            }
          } else if (buy) {
            if (
              open_value >= tsbuy ||
              low_value >= tsbuy ||
              high_value >= tsbuy
            ) {
              if (open_value >= ts6 || low_value >= ts6 || high_value >= ts6) {
                tp7b = true;
              } else if (
                open_value >= ts5 ||
                low_value >= ts5 ||
                high_value >= ts5
              ) {
                tp6b = true;
              } else if (
                open_value >= ts4 ||
                low_value >= ts4 ||
                high_value >= ts4
              ) {
                tp5b = true;
              } else if (
                open_value >= ts3 ||
                low_value >= ts3 ||
                high_value >= ts3
              ) {
                tp4b = true;
              } else if (
                open_value >= ts2 ||
                low_value >= ts2 ||
                high_value >= ts2
              ) {
                tp3b = true;
              } else if (
                open_value >= ts1 ||
                low_value >= ts1 ||
                high_value >= ts1
              ) {
                tp2b = true;
              } else if (
                open_value >= ts ||
                low_value >= ts ||
                high_value >= ts
              ) {
                tp1b = true;
              }
              if (tp7b) {
                stoploss = ts5;
              } else if (tp6b) {
                stoploss = ts4;
              } else if (tp5b) {
                stoploss = ts3;
              } else if (tp4b) {
                stoploss = ts2;
              } else if (tp3b) {
                stoploss = ts1;
              } else if (tp2b) {
                stoploss = ts;
              } else if (tp1b) {
                stoploss = ts;
              }
            } else if (
              (open_value >= bepbuy ||
                low_value >= bepbuy ||
                high_value >= bepbuy) &&
              !bep
            ) {
              bep = true;
              stoploss = buystop;
            }
          } //disini
          if (minute.getHours() >= enambelas.getHours()) {
            sell_stop = false;
            buy_stop = false;
          }
          if (minute.getHours() >= sixteen.getHours()) {
            simulasi(`OPEN : ${open_value}`);
            simulasi(counter);
            simulasi(`buy ${buystop}`);
            simulasi(`sell ${sellstop}`);
            simulasi(bep);
            if (buy) {
              hasil = parseFloat(open_value - entry).toFixed(2);
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              // break;
            } else if (sell) {
              hasil = parseFloat(entry - open_value).toFixed(2);
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              // break;
            }
            if (hasilpip !== 0) {
              risk = parseFloat(closepip / hasilpip).toFixed(2);
            } else {
              risk = 0; // or any other default value you want when hasilpip is 0
            }

            equity = parseFloat(equity * (risk / 100) + equity);
            updateTable(
              counter,
              minute,
              highestHigh,
              lowestLow,
              trend,
              setup,
              order,
              entry,
              stoploss,
              hasilpip,
              closesetup,
              closeprice,
              closepip,
              risk,
              equity
            );
            break;
          }
        } else if (fibo100 <= first_next && first_next <= fibo61) {
          // addParagraphToAnalisa(`OPEN C`);
          // console.log("OPEN C");
          var setup = "C";
          selisihbep = fibo0 - fibo23;
          c2a = (fibo61 + fibo100) / 2 - keypip;
          c2b = fibo61 - keypip;
          c2c = fibo100 - keypip;
          c2d = fibo61 + keypip + sphread;
          c2tp = fibo0 - keypip;
          c2tp1 = c2tp + trail;
          c2tp2 = c2tp1 + trail;
          c2tp3 = c2tp2 + trail;
          c2tp4 = c2tp3 + trail;
          c2tp5 = c2tp4 + trail;
          c2tp6 = c2tp5 + trail;
          ts = tssell + keypip + sphread;
          ts1 = ts - 4;
          ts2 = ts1 - 4;
          ts3 = ts2 - 4;
          ts4 = ts3 - 4;
          ts5 = ts4 - 4;
          ts6 = ts5 - 4;
          selisihts = fibo - c2d;
          tssell = c2c - selisihts;
          bepsell = tssell + selisihbep;
          if (!stop_loss) {
            if (
              (open_value <= stoploss ||
                low_value <= stoploss ||
                high_value <= stoploss) &&
              buy
            ) {
              buy = false;

              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL_STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Trail Stop";
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = false;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                  var closesetup = "Stop Loss";
                } else if (
                  bep &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = false;
                  bep = false;
                  var closesetup = "BEP";
                  var hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Trail Stop";
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }

              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                counter,
                minute,
                highestHigh,
                lowestLow,
                trend,
                setup,
                order,
                entry,
                stoploss,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,
                equity
              );
            } else if (
              (open_value >= stoploss ||
                low_value >= stoploss ||
                high_value >= stoploss) &&
              sell
            ) {
              sell = false;
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Trail Stop";
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                  var closesetup = "Stop Loss";
                } else if (
                  bep &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = true;
                  bep = false;
                  var closesetup = "BEP";
                  var hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Trail Stop";
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss}`);
                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }

              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                counter,
                minute,
                highestHigh,
                lowestLow,
                trend,
                setup,
                order,
                entry,
                stoploss,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,
                equity
              );
            }
          }
          if (c2d >= open_value && open_value >= c2c) {
            if (!setopen) {
              sellstop = c2c;
              simulasi(`SELL STOP : ${sellstop}`);
              sell_stop = true;
              buystop = c2d;
              simulasi(`BUY STOP : ${buystop}`);
              buy_stop = true;
              setopen = true;
            } else if (setopen) {
              if (open_value <= c2c || low_value <= c2c || high_value <= c2c) {
                if (counter >= 4) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (minute.getHours() >= enambelas.getHours()) {
                  sell_stop = false;
                  buy_stop = false;
                } else if (sell_stop && !sell) {
                  stop_loss = false;
                  var order = "Sell Stop";
                  var entry = sellstop;
                  simulasi(`SELL STOP AT : ${sellstop}`);
                  sell = true;
                  buy = false;
                  counter = counter + 1;
                  buy_stop = true;
                  sell_stop = false;
                  stoploss = buystop;
                  bep = false;
                  var hasilpip = parseFloat(stoploss - entry).toFixed(2);
                }
              } else if (
                open_value >= c2d ||
                low_value >= c2d ||
                high_value >= c2d
              ) {
                if (counter >= 4) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (minute.getHours() >= enambelas.getHours()) {
                  sell_stop = false;
                  buy_stop = false;
                } else if (buy_stop && !buy) {
                  stop_loss = false;
                  var order = "Buy Stop";
                  var entry = buystop;
                  simulasi(`BUY STOP AT ${buystop}`);
                  sell = false;
                  buy = true;
                  counter = counter + 1;
                  sell_stop = true;
                  buy_stop = false;
                  stoploss = sellstop;
                  bep = false;
                  var hasilpip = parseFloat(entry - stoploss).toFixed(2);
                }
              }
            }
          }
          if (sell) {
            if (
              open_value <= tssell ||
              low_value <= tssell ||
              high_value <= tssell
            ) {
              if (open_value <= ts6 || low_value <= ts6 || high_value <= ts6) {
                tp7s = true;
              } else if (
                open_value <= ts5 ||
                low_value <= ts5 ||
                high_value <= ts5
              ) {
                tp6s = true;
              } else if (
                open_value <= ts4 ||
                low_value <= ts4 ||
                high_value <= ts4
              ) {
                tp5s = true;
              } else if (
                open_value <= ts3 ||
                low_value <= ts3 ||
                high_value <= ts3
              ) {
                tp4s = true;
              } else if (
                open_value <= ts2 ||
                low_value <= ts2 ||
                high_value <= ts2
              ) {
                tp3s = true;
              } else if (
                open_value <= ts1 ||
                low_value <= ts1 ||
                high_value <= ts1
              ) {
                tp2s = true;
              } else if (
                open_value <= ts ||
                low_value <= ts ||
                high_value <= ts
              ) {
                tp1s = true;
              }
              if (tp7s) {
                stoploss = ts5;
              } else if (tp6s) {
                stoploss = ts4;
              } else if (tp5s) {
                stoploss = ts3;
              } else if (tp4s) {
                stoploss = ts2;
              } else if (tp3s) {
                stoploss = ts1;
              } else if (tp2s) {
                stoploss = ts;
              } else if (tp1s) {
                stoploss = ts;
              }
            } else if (
              (open_value <= bepsell ||
                low_value <= bepsell ||
                high_value <= bepsell) &&
              !bep
            ) {
              bep = true;
              stoploss = sellstop;
            }
          } else if (buy) {
            if (
              open_value >= fibo0 ||
              low_value >= fibo0 ||
              high_value >= fibo0
            ) {
              if (
                open_value >= c2tp6 ||
                low_value >= c2tp6 ||
                high_value >= c2tp6
              ) {
                tp7b = true;
              } else if (
                open_value >= c2tp5 ||
                low_value >= c2tp5 ||
                high_value >= c2tp5
              ) {
                tp6b = true;
              } else if (
                open_value >= c2tp4 ||
                low_value >= c2tp4 ||
                high_value >= c2tp4
              ) {
                tp5b = true;
              } else if (
                open_value >= c2tp3 ||
                low_value >= c2tp3 ||
                high_value >= c2tp3
              ) {
                tp4b = true;
              } else if (
                open_value >= c2tp2 ||
                low_value >= c2tp2 ||
                high_value >= c2tp2
              ) {
                tp3b = true;
              } else if (
                open_value >= c2tp1 ||
                low_value >= c2tp1 ||
                high_value >= c2tp1
              ) {
                tp2b = true;
              } else if (
                open_value >= c2tp ||
                low_value >= c2tp ||
                high_value >= c2tp
              ) {
                tp1b = true;
              }
              if (tp7b) {
                stoploss = c2tp5;
              } else if (tp6b) {
                stoploss = c2tp4;
              } else if (tp5b) {
                stoploss = c2tp3;
              } else if (tp4b) {
                stoploss = c2tp2;
              } else if (tp3b) {
                stoploss = c2tp1;
              } else if (tp2b) {
                stoploss = c2tp;
              } else if (tp1b) {
                stoploss = c2tp;
              }
            } else if (
              (open_value >= fibo23 ||
                low_value >= fibo23 ||
                high_value >= fibo23) &&
              !bep
            ) {
              bep = true;
              stoploss = buystop;
            }
          }
          if (minute.getHours() >= enambelas.getHours()) {
            sell_stop = false;
            buy_stop = false;
          }
          if (minute.getHours() >= sixteen.getHours()) {
            simulasi(`OPEN : ${open_value}`);
            simulasi(counter);
            simulasi(`buy ${buystop}`);
            simulasi(`sell ${sellstop}`);
            simulasi(bep);
            if (buy) {
              hasil = parseFloat(open_value - entry).toFixed(2);

              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              // break;
            } else if (sell) {
              hasil = parseFloat(entry - open_value).toFixed(2);

              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              // break;
            }
            if (hasilpip !== 0) {
              risk = parseFloat(closepip / hasilpip).toFixed(2);
            } else {
              risk = 0; // or any other default value you want when hasilpip is 0
            }

            equity = parseFloat(equity * (risk / 100) + equity);
            updateTable(
              counter,
              minute,
              highestHigh,
              lowestLow,
              trend,
              setup,
              order,
              entry,
              stoploss,
              hasilpip,
              closesetup,
              closeprice,
              closepip,
              risk,
              equity
            );
            break;
          }
        }
      } else {
        var trend = "DOWN";
        downtrend = true;
        if (fibo61 >= first_next && first_next >= fibo23) {
          // addParagraphToAnalisa(`OPEN A`);
          var setup = "A";
          selisihbep = parseFloat(fibo23 - fibo0).toFixed(2);
          tssell = parseFloat(fibo0 - selisihbep).toFixed(2);
          a1a = parseFloat(fibo50 + keypip + sphread).toFixed(2);
          a1atp = tsbuy - keypip;
          a1atp1 = a1atp + trail;
          a1atp2 = a1atp1 + trail;
          a1atp3 = a1atp2 + trail;
          a1atp4 = a1atp3 + trail;
          a1atp5 = a1atp4 + trail;
          a1atp6 = a1atp5 + trail;
          a1b = parseFloat(fibo50 - keypip).toFixed(2);
          a1btp = tssell + keypip + sphread;
          a1btp1 = a1btp - trail;
          a1btp2 = a1btp1 - trail;
          a1btp3 = a1btp2 - trail;
          a1btp4 = a1btp3 - trail;
          a1btp5 = a1btp4 - trail;
          a1btp6 = a1btp5 - trail;
          selisihts = parseFloat(a1b - tssell).toFixed(2);
          tsbuy = parseFloat(fibo100 + selisihbep).toFixed(2);
          if (!stop_loss) {
            if (
              (open_value <= stoploss ||
                low_value <= stoploss ||
                high_value <= stoploss) &&
              buy
            ) {
              if (counter < 5) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Trail Stop";
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  buy_stop = true;
                  sell_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                  var closesetup = "Stop Loss";
                } else if (
                  bep &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = false;
                  bep = false;
                  var closesetup = "BEP";
                  var hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Trail Stop";
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              buy = false;
              var closeprice = parseFloat(stoploss).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }

              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                counter,
                minute,
                highestHigh,
                lowestLow,
                trend,
                setup,
                order,
                entry,
                stoploss,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,
                equity
              );
            }
            if (
              (open_value >= stoploss ||
                low_value >= stoploss ||
                high_value >= stoploss) &&
              sell
            ) {
              sell = false;
              if (counter < 5) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(sellstop - stoploss);
                  simulasi(hasil);
                  var closesetup = "Trail Stop";
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  buy_stop = true;
                  sell_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                  var closesetup = "Stop Loss";
                } else if (
                  bep &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = true;
                  bep = false;
                  var closesetup = "BEP";
                  var hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Trail Stop";
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss}`);

                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }

              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                counter,
                minute,
                highestHigh,
                lowestLow,
                trend,
                setup,
                order,
                entry,
                stoploss,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,
                equity
              );
            }
          }
          if (
            (a1a >= open_value && open_value >= a1b) ||
            (a1a >= high_value && high_value >= a1b) ||
            (a1a >= low_value && low_value >= a1b)
          ) {
            if (!setopen) {
              sellstop = a1b;
              console.log(`SELL STOP : ${sellstop}`);
              simulasi(`SELL STOP : ${sellstop}`);
              sell_stop = true;
              buystop = a1a;
              console.log(`BUY STOP : ${buystop}`);
              simulasi(`BUY STOP : ${buystop}`);
              buy_stop = true;
              setopen = true;
            } else if (setopen) {
              if (open_value <= a1b || low_value <= a1b || high_value <= a1b) {
                if (counter >= 4) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (minute.getHours() >= enambelas.getHours()) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (sell_stop && !sell) {
                  stop_loss = false;
                  var order = "Sell Stop";
                  var entry = sellstop;
                  console.log(`SELL STOP AT : ${sellstop}`);
                  simulasi(`SELL STOP AT : ${sellstop} in ${minute}`);
                  sell = true;
                  buy = false;
                  counter = counter + 1;
                  buy_stop = true;
                  buystop = a1a;
                  stoploss = buystop;
                  sell_stop = false;
                  var hasilpip = parseFloat(stoploss - entry).toFixed(2);
                }
              } else if (
                open_value >= a1a ||
                low_value >= a1a ||
                high_value >= a1a
              ) {
                if (counter >= 4) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (minute.getHours() >= enambelas.getHours()) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (buy_stop && !buy) {
                  stop_loss = false;
                  var order = "Buy Stop";
                  var entry = buystop;
                  console.log(`BUY STOP AT : ${buystop}`);
                  simulasi(`BUY STOP AT : ${buystop} in ${minute}`);
                  buy = true;
                  sell = false;
                  counter = counter + 1;
                  buy_stop = false;
                  sellstop = a1b;
                  stoploss = sellstop;
                  sell_stop = true;
                  var hasilpip = parseFloat(entry - stoploss).toFixed(2);
                }
              }
            }
          }
          if (buy) {
            if (
              open_value >= tsbuy ||
              low_value >= tsbuy ||
              high_value >= tsbuy
            ) {
              if (
                open_value >= a1atp6 ||
                low_value >= a1atp6 ||
                high_value >= a1atp6
              ) {
                tp7b = true;
              } else if (
                open_value >= a1atp5 ||
                low_value >= a1atp5 ||
                high_value >= a1atp5
              ) {
                tp6b = true;
              } else if (
                open_value >= a1atp4 ||
                low_value >= a1atp4 ||
                high_value >= a1atp4
              ) {
                tp5b = true;
              } else if (
                open_value >= a1atp3 ||
                low_value >= a1atp3 ||
                high_value >= a1atp3
              ) {
                tp4b = true;
              } else if (
                open_value >= a1atp2 ||
                low_value >= a1atp2 ||
                high_value >= a1atp2
              ) {
                tp3b = true;
              } else if (
                open_value >= a1atp1 ||
                low_value >= a1atp1 ||
                high_value >= a1atp1
              ) {
                tp2b = true;
              } else if (
                open_value >= a1atp ||
                low_value >= a1atp ||
                high_value >= a1atp
              ) {
                tp1b = true;
              }
              if (tp7b) {
                stoploss = a1atp5;
              } else if (tp6b) {
                stoploss = a1atp4;
              } else if (tp5b) {
                stoploss = a1atp3;
              } else if (tp4b) {
                stoploss = a1atp2;
              } else if (tp3b) {
                stoploss = a1atp1;
              } else if (tp2b) {
                stoploss = a1atp;
              } else if (tp1b) {
                stoploss = a1atp;
              }
            } else if (
              (open_value >= fibo100 ||
                low_value >= fibo100 ||
                high_value >= fibo100) &&
              !bep
            ) {
              bep = true;
              stoploss = buystop;
            }
          } else if (sell) {
            if (
              open_value <= tssell ||
              low_value <= tssell ||
              high_value <= tssell
            ) {
              if (
                open_value <= a1btp6 ||
                low_value <= a1btp6 ||
                high_value <= a1btp6
              ) {
                tp7s = true;
              } else if (
                open_value <= a1btp5 ||
                low_value <= a1btp5 ||
                high_value <= a1btp5
              ) {
                tp6s = true;
              } else if (
                open_value <= a1btp4 ||
                low_value <= a1btp4 ||
                high_value <= a1btp4
              ) {
                tp5s = true;
              } else if (
                open_value <= a1btp3 ||
                low_value <= a1btp3 ||
                high_value <= a1btp3
              ) {
                tp4s = true;
              } else if (
                open_value <= a1btp2 ||
                low_value <= a1btp2 ||
                high_value <= a1btp2
              ) {
                tp3s = true;
              } else if (
                open_value <= a1btp1 ||
                low_value <= a1btp1 ||
                high_value <= a1btp1
              ) {
                tp2s = true;
              } else if (
                open_value <= a1btp ||
                low_value <= a1btp ||
                high_value <= a1btp
              ) {
                tp1s = true;
              }
              if (tp7s) {
                stoploss = a1btp5;
              } else if (tp6s) {
                stoploss = a1btp4;
              } else if (tp5s) {
                stoploss = a1btp3;
              } else if (tp4s) {
                stoploss = a1btp2;
              } else if (tp3s) {
                stoploss = a1btp1;
              } else if (tp2s) {
                stoploss = a1btp;
              } else if (tp1s) {
                stoploss = a1btp;
              }
            } else if (
              (open_value <= fibo0 ||
                low_value <= fibo0 ||
                high_value <= fibo0) &&
              !bep
            ) {
              bep = true;
              stoploss = sellstop;
            }
          }
          if (minute.getHours() >= enambelas.getHours()) {
            sell_stop = false;
            buy_stop = false;
          }
          if (minute.getHours() >= sixteen.getHours()) {
            simulasi(`OPEN : ${open_value}`);
            simulasi(counter);
            simulasi(`buy ${buystop}`);
            simulasi(`sell ${sellstop}`);
            simulasi(bep);
            if (buy) {
              hasil = parseFloat(open_value - entry).toFixed(2);

              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              // break;
            } else if (sell) {
              hasil = parseFloat(entry - open_value).toFixed(2);

              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              // break;
            }
            if (hasilpip !== 0) {
              risk = parseFloat(closepip / hasilpip).toFixed(2);
            } else {
              risk = 0; // or any other default value you want when hasilpip is 0
            }

            equity = parseFloat(equity * (risk / 100) + equity);
            updateTable(
              counter,
              minute,
              highestHigh,
              lowestLow,
              trend,
              setup,
              order,
              entry,
              stoploss,
              hasilpip,
              closesetup,
              closeprice,
              closepip,
              risk,
              equity
            );
            break;
          }
        } else if (fibo23 >= first_next && first_next >= fibo0) {
          var setup = "B";
          var selisihbep = parseFloat(fibo100 - fibo61).toFixed(2);
          var b1a = (fibo0 + fibo23) / 2 + keypip + sphread;
          var b1b = fibo0 + keypip + sphread;
          var b1c = parseFloat(fibo0 - keypip).toFixed(2);
          var b1d = parseFloat(fibo23 + keypip + sphread).toFixed(2);
          var b1tp = fibo100 - keypip;
          var b1tp1 = b1tp + trail;
          var b1tp2 = b1tp1 + trail;
          var b1tp3 = b1tp2 + trail;
          var b1tp4 = b1tp3 + trail;
          var b1tp5 = b1tp4 + trail;
          var b1tp6 = b1tp5 + trail;
          var ts = parseFloat(tssell + keypip + sphread).toFixed(2);
          var ts1 = ts - 4;
          var ts2 = ts1 - 4;
          var ts3 = ts2 - 4;
          var ts4 = ts3 - 4;
          var ts5 = ts4 - 4;
          var ts6 = ts5 - 4;
          var selisihts = parseFloat(fibo100 - b1d).toFixed(2);
          var tssell = parseFloat(b1c - selisihts).toFixed(2);
          var bepsell = parseFloat(tssell + selisihbep).toFixed(2);
          if (!stop_loss) {
            if (
              (open_value <= stoploss ||
                low_value <= stoploss ||
                high_value <= stoploss) &&
              buy
            ) {
              buy = false;

              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Trail Stop";
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  buy_stop = true;
                  sell_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                  var closesetup = "Stop Loss";
                } else if (
                  bep &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = false;
                  bep = false;
                  var closesetup = "BEP";
                  var hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Trail Stop";
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }

              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                counter,
                minute,
                highestHigh,
                lowestLow,
                trend,
                setup,
                order,
                entry,
                stoploss,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,
                equity
              );
            }
            if (
              (open_value >= stoploss ||
                low_value >= stoploss ||
                high_value >= stoploss) &&
              sell
            ) {
              sell = false;
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(sellstop - stoploss);
                  simulasi(hasil);
                  var closesetup = "Trail Stop";
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  buy_stop = true;
                  sell_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                  var closesetup = "Stop Loss";
                } else if (
                  bep &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = true;
                  bep = false;
                  var closesetup = "BEP";
                  var hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Trail Stop";
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss}`);
                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else {
                risk = 0; // or any other default value you want when hasilpip is 0
              }

              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                counter,
                minute,
                highestHigh,
                lowestLow,
                trend,
                setup,
                order,
                entry,
                stoploss,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,
                equity
              );
            }
          }

          if (b1d >= open_value && open_value >= b1c) {
            if (!setopen) {
              sellstop = b1c;
              simulasi(`SELL STOP : ${sellstop}`);
              sell_stop = true;
              buystop = b1d;
              simulasi(`BUY STOP : ${buystop}`);
              buy_stop = true;
              setopen = true;
            } else if (setopen) {
              if (
                open_value <= sellstop ||
                low_value <= sellstop ||
                high_value <= sellstop
              ) {
                if (counter >= 4) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (minute.getHours() >= enambelas.getHours()) {
                  sell_stop = false;
                  buy_stop = false;
                } else if (sell_stop && !sell) {
                  stop_loss = false;
                  var order = "Sell Stop";
                  var entry = sellstop;
                  simulasi(`SELL STOP AT: ${sellstop} in ${minute}`);
                  sell = true;
                  buy = false;
                  counter = counter + 1;
                  buy_stop = true;
                  sell_stop = false;
                  stoploss = buystop;
                  bep = false;
                  var hasilpip = parseFloat(stoploss - entry).toFixed(2);
                }
              } else if (
                open_value >= buystop ||
                low_value >= buystop ||
                high_value >= buystop
              ) {
                if (counter >= 4) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (
                  minute.getHours() >= enambelas.getHours() &&
                  (!buy_stop || !sell1)
                ) {
                  sell_stop = false;
                  buy_stop = false;
                } else if (buy_stop && !buy) {
                  stop_loss = false;
                  var order = "Buy Stop";
                  var entry = buystop;
                  simulasi(`BUY STOP AT: ${buystop} in ${minute}`);
                  sell = false;
                  buy = true;
                  counter = counter + 1;
                  sell_stop = true;
                  buy_stop = false;
                  stoploss = sellstop;
                  bep = false;
                  var hasilpip = parseFloat(entry - stoploss).toFixed(2);
                }
              }
            }
          }
          if (sell) {
            if (
              open_value <= tssell ||
              low_value <= tssell ||
              high_value <= tssell
            ) {
              if (open_value <= ts6 || low_value <= ts6 || high_value <= ts6) {
                tp7s = true;
              } else if (
                open_value <= ts5 ||
                low_value <= ts5 ||
                high_value <= ts5
              ) {
                tp6s = true;
              } else if (
                open_value <= ts4 ||
                low_value <= ts4 ||
                high_value <= ts4
              ) {
                tp5s = true;
              } else if (
                open_value <= ts3 ||
                low_value <= ts3 ||
                high_value <= ts3
              ) {
                tp4s = true;
              } else if (
                open_value <= ts2 ||
                low_value <= ts2 ||
                high_value <= ts2
              ) {
                tp3s = true;
              } else if (
                open_value <= ts1 ||
                low_value <= ts1 ||
                high_value <= ts1
              ) {
                tp2s = true;
              } else if (
                open_value <= ts ||
                low_value <= ts ||
                high_value <= ts
              ) {
                tp1s = true;
              }
              if (tp7s) {
                stoploss = ts5;
              } else if (tp6s) {
                stoploss = ts4;
              } else if (tp5s) {
                stoploss = ts3;
              } else if (tp4s) {
                stoploss = ts2;
              } else if (tp3s) {
                stoploss = ts1;
              } else if (tp2s) {
                stoploss = ts;
              } else if (tp1s) {
                stoploss = ts;
              }
            } else if (
              (open_value <= bepsell ||
                low_value <= bepsell ||
                high_value <= bepsell) &&
              !bep
            ) {
              bep = true;
              stoploss = sellstop;
            }
          } else if (buy) {
            if (
              open_value >= fibo100 ||
              low_value >= fibo100 ||
              high_value >= fibo100
            ) {
              if (
                open_value >= b1tp6 ||
                low_value >= b1tp6 ||
                high_value >= b1tp6
              ) {
                tp7b = true;
              } else if (
                open_value >= b1tp5 ||
                low_value >= b1tp5 ||
                high_value >= b1tp5
              ) {
                tp6b = true;
              } else if (
                open_value >= b1tp4 ||
                low_value >= b1tp4 ||
                high_value >= b1tp4
              ) {
                tp5b = true;
              } else if (
                open_value >= b1tp3 ||
                low_value >= b1tp3 ||
                high_value >= b1tp3
              ) {
                tp4b = true;
              } else if (
                open_value >= b1tp2 ||
                low_value >= b1tp2 ||
                high_value >= b1tp2
              ) {
                tp3b = true;
              } else if (
                open_value >= b1tp1 ||
                low_value >= b1tp1 ||
                high_value >= b1tp1
              ) {
                tp2b = true;
              } else if (
                open_value >= b1tp ||
                low_value >= b1tp ||
                high_value >= b1tp
              ) {
                tp1b = true;
              }
              if (tp7b) {
                stoploss = b1tp5;
              } else if (tp6b) {
                stoploss = b1tp4;
              } else if (tp5b) {
                stoploss = b1tp3;
              } else if (tp4b) {
                stoploss = b1tp2;
              } else if (tp3b) {
                stoploss = b1tp1;
              } else if (tp2b) {
                stoploss = b1tp;
              } else if (tp1b) {
                stoploss = b1tp;
              }
            } else if (
              (open_value >= fibo61 ||
                low_value >= fibo61 ||
                high_value >= fibo61) &&
              !bep
            ) {
              bep = true;
              stoploss = buystop;
            }
          }
          if (minute.getHours() >= enambelas.getHours()) {
            sell_stop = false;
            buy_stop = false;
          }
          if (minute.getHours() >= sixteen.getHours()) {
            simulasi(`OPEN : ${open_value}`);
            simulasi(counter);
            simulasi(`buy ${buystop}`);
            simulasi(`sell ${sellstop}`);
            simulasi(bep);
            if (buy) {
              hasil = parseFloat(open_value - entry).toFixed(2);
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              // break;
            } else if (sell) {
              hasil = parseFloat(entry - open_value).toFixed(2);
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              // break;
            }
            if (hasilpip !== 0) {
              risk = parseFloat(closepip / hasilpip).toFixed(2);
            } else {
              risk = 0; // or any other default value you want when hasilpip is 0
            }

            equity = parseFloat(equity * (risk / 100) + equity);
            updateTable(
              counter,
              minute,
              highestHigh,
              lowestLow,
              trend,
              setup,
              order,
              entry,
              stoploss,
              hasilpip,
              closesetup,
              closeprice,
              closepip,
              risk,
              equity
            );
            break;
          }
        } else if (fibo100 >= first_next && first_next >= fibo61) {
          // addParagraphToAnalisa(`OPEN C`);
          // console.log("OPEN C");
          var setup = "C";
          selisihbep = fibo0 - fibo23;
          c1a = (fibo61 + fibo100) / 2 + keypip + sphread;
          c1b = fibo61 + keypip + sphread;
          c1c = fibo100 + keypip + sphread;
          c1d = fibo61 - keypip;
          c1tp = fibo0 + keypip + sphread;
          c1tp1 = c1tp - trail;
          c1tp2 = c1tp1 - trail;
          c1tp3 = c1tp2 - trail;
          c1tp4 = c1tp3 - trail;
          c1tp5 = c1tp4 - trail;
          c1tp6 = c1tp5 - trail;
          ts = tssell + keypip + sphread;
          ts1 = ts - 4;
          ts2 = ts1 - 4;
          ts3 = ts2 - 4;
          ts4 = ts3 - 4;
          ts5 = ts4 - 4;
          ts6 = ts5 - 4;
          selisihts = c1d - fibo0;
          tssell = c1c + selisihts;
          bepsell = tsbuy - selisihbep;
          if (!stop_loss) {
            if (
              (open_value <= stoploss ||
                low_value <= stoploss ||
                high_value <= stoploss) &&
              buy
            ) {
              buy = false;

              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL_STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Trail Stop";
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = false;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                  var closesetup = "Stop Loss";
                } else if (
                  bep &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = false;
                  bep = false;
                  var closesetup = "BEP";
                  var hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Trail Stop";
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }

              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                counter,
                minute,
                highestHigh,
                lowestLow,
                trend,
                setup,
                order,
                entry,
                stoploss,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,
                equity
              );
            } else if (
              (open_value >= stoploss ||
                low_value >= stoploss ||
                high_value >= stoploss) &&
              sell
            ) {
              sell = false;
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Trail Stop";
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                  var closesetup = "Stop Loss";
                } else if (
                  bep &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = true;
                  bep = false;
                  var closesetup = "BEP";
                  var hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Trail Stop";
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss}`);
                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }

              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                counter,
                minute,
                highestHigh,
                lowestLow,
                trend,
                setup,
                order,
                entry,
                stoploss,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,
                equity
              );
            }
          }
          if (c1d <= open_value && open_value <= c1c) {
            if (!setopen) {
              sellstop = c1d;
              simulasi(`SELL STOP : ${sellstop}`);
              sell_stop = true;
              buystop = c1c;
              simulasi(`BUY STOP : ${buystop}`);
              buy_stop = true;
              setopen = true;
            } else if (setopen) {
              if (
                open_value <= sellstop ||
                low_value <= sellstop ||
                high_value <= sellstop
              ) {
                if (counter >= 4) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (minute.getHours() >= enambelas.getHours()) {
                  sell_stop = false;
                  buy_stop = false;
                } else if (sell_stop && !sell) {
                  stop_loss = false;
                  var order = "Sell Stop";
                  var entry = sellstop;
                  simulasi(`SELL STOP AT : ${sellstop}`);
                  sell = true;
                  buy = false;
                  counter = counter + 1;
                  buy_stop = true;
                  sell_stop = false;
                  stoploss = buystop;
                  bep = false;
                  var hasilpip = parseFloat(stoploss - entry).toFixed(2);
                }
              } else if (
                open_value >= buystop ||
                low_value >= buystop ||
                high_value >= buystop
              ) {
                if (counter >= 4) {
                  buy_stop = false;
                  sell_stop = false;
                } else if (minute.getHours() >= enambelas.getHours()) {
                  sell_stop = false;
                  buy_stop = false;
                } else if (buy_stop && !buy) {
                  stop_loss = false;
                  var order = "Buy Stop";
                  var entry = buystop;
                  simulasi(`BUY STOP AT ${buystop}`);
                  sell = false;
                  buy = true;
                  counter = counter + 1;
                  sell_stop = true;
                  buy_stop = false;
                  stoploss = sellstop;
                  bep = false;
                  var hasilpip = parseFloat(entry - stoploss).toFixed(2);
                }
              }
            }
          }
          if (sell) {
            if (
              open_value <= fibo0 ||
              low_value <= fibo0 ||
              high_value <= fibo0
            ) {
              if (
                open_value <= c1tp6 ||
                low_value <= c1tp6 ||
                high_value <= c1tp6
              ) {
                tp7s = true;
              } else if (
                open_value <= c1tp5 ||
                low_value <= c1tp5 ||
                high_value <= c1tp5
              ) {
                tp6s = true;
              } else if (
                open_value <= c1tp4 ||
                low_value <= c1tp4 ||
                high_value <= c1tp4
              ) {
                tp5s = true;
              } else if (
                open_value <= c1tp3 ||
                low_value <= c1tp3 ||
                high_value <= c1tp3
              ) {
                tp4s = true;
              } else if (
                open_value <= c1tp2 ||
                low_value <= c1tp2 ||
                high_value <= c1tp2
              ) {
                tp3s = true;
              } else if (
                open_value <= c1tp1 ||
                low_value <= c1tp1 ||
                high_value <= c1tp1
              ) {
                tp2s = true;
              } else if (
                open_value <= c1tp ||
                low_value <= c1tp ||
                high_value <= c1tp
              ) {
                tp1s = true;
              }
              if (tp7s) {
                stoploss = c1tp5;
              } else if (tp6s) {
                stoploss = c1tp4;
              } else if (tp5s) {
                stoploss = c1tp3;
              } else if (tp4s) {
                stoploss = c1tp2;
              } else if (tp3s) {
                stoploss = c1tp1;
              } else if (tp2s) {
                stoploss = c1tp;
              } else if (tp1s) {
                stoploss = c1tp;
              }
            } else if (
              (open_value <= fibo23 ||
                low_value <= fibo23 ||
                high_value <= fibo23) &&
              !bep
            ) {
              bep = true;
              stoploss = sellstop;
            }
          } else if (buy) {
            if (
              open_value >= tsbuy ||
              low_value >= tsbuy ||
              high_value >= tsbuy
            ) {
              if (open_value >= ts6 || low_value >= ts6 || high_value >= ts6) {
                tp7b = true;
              } else if (
                open_value >= ts5 ||
                low_value >= ts5 ||
                high_value >= ts5
              ) {
                tp6b = true;
              } else if (
                open_value >= ts4 ||
                low_value >= ts4 ||
                high_value >= ts4
              ) {
                tp5b = true;
              } else if (
                open_value >= ts3 ||
                low_value >= ts3 ||
                high_value >= ts3
              ) {
                tp4b = true;
              } else if (
                open_value >= ts2 ||
                low_value >= ts2 ||
                high_value >= ts2
              ) {
                tp3b = true;
              } else if (
                open_value >= ts1 ||
                low_value >= ts1 ||
                high_value >= ts1
              ) {
                tp2b = true;
              } else if (
                open_value >= ts ||
                low_value >= ts ||
                high_value >= ts
              ) {
                tp1b = true;
              }
              if (tp7b) {
                stoploss = ts5;
              } else if (tp6b) {
                stoploss = ts4;
              } else if (tp5b) {
                stoploss = ts3;
              } else if (tp4b) {
                stoploss = ts2;
              } else if (tp3b) {
                stoploss = ts1;
              } else if (tp2b) {
                stoploss = ts;
              } else if (tp1b) {
                stoploss = ts;
              }
            } else if (
              (open_value >= bepbuy ||
                low_value >= bepbuy ||
                high_value >= bepbuy) &&
              !bep
            ) {
              bep = true;
              stoploss = buystop;
            }
          }
          if (minute.getHours() >= enambelas.getHours()) {
            sell_stop = false;
            buy_stop = false;
          }
          if (minute.getHours() >= sixteen.getHours()) {
            simulasi(`OPEN : ${open_value}`);
            simulasi(counter);
            simulasi(`buy ${buystop}`);
            simulasi(`sell ${sellstop}`);
            simulasi(bep);
            if (buy) {
              hasil = parseFloat(open_value - entry).toFixed(2);

              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              // break;
            } else if (sell) {
              hasil = parseFloat(entry - open_value).toFixed(2);

              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              // break;
            }
            if (!buy && !sell) {
              order = 0;
              entry = 0;
              stoploss = 0;
              hasilpip = 0;
              closesetup = "";
              closeprice = 0;
              closepip = 0;
              risk = 0;
            }
            if (hasilpip !== 0) {
              risk = parseFloat(closepip / hasilpip).toFixed(2);
            } else {
              risk = 0; // or any other default value you want when hasilpip is 0
            }
            equity = parseFloat(equity * (risk / 100) + equity);
            updateTable(
              counter,
              minute,
              highestHigh,
              lowestLow,
              trend,
              setup,
              order,
              entry,
              stoploss,
              hasilpip,
              closesetup,
              closeprice,
              closepip,
              risk,
              equity
            );
            break;
          }
        }
      }
    }
    console.log(`equity = ${equity}`);
  });
  tablecounter++;
}
function findLowest(data) {
  var lowest = Number.MAX_VALUE;
  data.forEach(function (d) {
    lowest = Math.min(lowest, d.Low);
  });
  return lowest;
}

// Fungsi untuk mencari nilai tertinggi pada kolom "High"
function findHighest(data) {
  var highest = Number.MIN_VALUE;
  data.forEach(function (d) {
    highest = Math.max(highest, d.High);
  });
  return highest;
}
function togglePanel() {
  var panel = document.querySelector(".panel");
  var analisabox = document.querySelector(".analisis");
  panel.style.display = panel.style.display === "none" ? "flex" : "none";
  analisabox.style.display =
    analisabox.style.display === "none" ? "flex" : "none";
}
// validateAndPlot();

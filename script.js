function togglePanel() {
  var panel = document.querySelector(".panel");
  var analisabox = document.querySelector(".analisis");
  panel.style.display = panel.style.display === "none" ? "flex" : "none";
  analisabox.style.display =
    analisabox.style.display === "none" ? "flex" : "none";
}
var bepa = false;
var onlya = false;
function inverseonoff() {
  var checkbox = document.getElementById("option1");
  if (checkbox.checked) {
    invers = true;
  } else {
    invers = false;
  }
}
function onlyaonoff() {
  var onlyacheckbox = document.getElementById("onlya");
  if (onlyacheckbox.checked) {
    onlya = true;
  } else {
    onlya = false;
  }
  console.log(`ONLY A = ${onlya}`);
}
function bepaonoff() {
  var bepcheckbox = document.getElementById("bepa");
  if (bepcheckbox.checked) {
    bepa = true;
  } else {
    bepa = false;
  }
  console.log(`BEP A = ${bepa}`);
}
function abonoff() {
  var abcheckbox = document.getElementById("abcheck");
  if (abcheckbox.checked) {
    checkab = true;
  } else {
    checkab = false;
  }
  console.log(`ab = ${checkab}`);
}
var invers = false;
var checkab = false;
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
  a.download = "backtest.csv";
  document.body.appendChild(a);
  a.click();

  // Hapus tautan setelah diunduh
  document.body.removeChild(a);
}

var tablecounter = 1; // Variable untuk menyimpan nilai counter tabel

function updateTable(
  tab,
  formattedDate,
  day,
  time,
  highestHigh,
  lowestLow,
  range,
  vlm,
  letter,
  trend,
  setup,
  order,
  entry,
  lossvalue,
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
              <th>Day</th>
              <th>Date</th>
              <th>Time</th>
              <th>High</th>
              <th>Low</th>
              <th>Range</th>
              <th>Volume</th>
              <th>Trend</th>
              <th>Letter</th>
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
  var row = tbody.querySelector(`tr[data-counter="${tab}"]`);
  if (!row) {
    // Jika baris belum ada, buat baris baru
    row = document.createElement("tr");
    row.setAttribute("data-counter", tab);
    tbody.appendChild(row);
  }

  // Perbarui atau tambahkan nilai ke kolom-kolom tabel
  row.innerHTML = `
        <td>${tab}</td>
        <td>${day}</td>
        <td>${formattedDate}</td>
        <td>${time}</td>
        <td>${highestHigh}</td>
        <td>${lowestLow}</td>
        <td>${parseFloat(range).toFixed(2)}</td>
        <td>${parseFloat(vlm).toFixed(0)}</td>
        <td>${trend}</td>
        <td>${letter}</td>
        <td>${setup}</td>
        <td>${order}</td>
        <td>${parseFloat(entry).toFixed(2)}</td>
        <td>${parseFloat(lossvalue).toFixed(2)}</td>
        <td>${parseFloat(hasilpip).toFixed(2)}</td>
        <td>${closesetup}</td>
        <td>${parseFloat(closeprice).toFixed(2)}</td>
        <td>${parseFloat(closepip).toFixed(2)}</td>
        <td>${parseFloat(risk).toFixed(2)}%</td>
        <td>${parseFloat(equity).toFixed(2)}</td>
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

    await new Promise((resolve) => setTimeout(resolve, 3000));
    startToday = new Date(startTomorrow);
  }
}
var equity = 5000.0;
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
  function abactive() {
    if (checkab) {
      ab = true;
    } else {
      ab = false;
    }
  }
  simulasi(`inverse = ${invers}`);

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
            Volume: d.Volume,
          };
        } else {
          // Update high, low, and close for the same minute
          currentMinuteData.High = Math.max(currentMinuteData.High, d.High);
          currentMinuteData.Low = Math.min(currentMinuteData.Low, d.Low);
          currentMinuteData.Close = d.Close;
          currentMinuteData.Volume = d.Volume;
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
    var selectedTomorrowData = aggregateDataHourly(tomorrowData);
    var highestHighTomorrow = findHighest(selectedTomorrowData);
    var vlm = totalvolume(selectedData);
    var lowestLowTomorrow = findLowest(selectedTomorrowData);
    var range = highestHigh - lowestLow;
    console.log(`${highestHighTomorrow} ${lowestLowTomorrow} ${range}`);
    var lowestLowIndex = findIndexByValue(selectedAggregatedData, lowestLow);
    var highestHighIndex = findIndexByValue(
      selectedAggregatedData,
      highestHigh
    );

    // Hitung level Fibonacci
    var fibonacciLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

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
    var fibo78 = fibonacciValues[5];
    var fibo100 = fibonacciValues[6];
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
            color: "rgba(rgba(3, 138, 255,1))",
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
            color: "rgba(3, 138, 255,1)",
            width: 2,
            dash: "dashdot",
          },
        };
      }),
    };
    Plotly.newPlot("tomorrow", [tomorrowTrace], layoutTomorrow);

    function updateplot() {
      // Ambil jumlah argumen yang diberikan
      var numArgs = arguments.length;

      // Loop melalui argumen dan tambahkan garis pada plot
      for (var i = 0; i < numArgs; i += 4) {
        var yValue1 = arguments[i];
        var yValue2 = arguments[i + 1];
        var yValue3 = arguments[i + 2];
        var yValue4 = arguments[i + 3];

        // Tambahkan garis horizontal pertama pada layoutTomorrow.shapes
        layoutTomorrow.shapes.push({
          type: "line",
          xref: "paper",
          x0: 0,
          x1: 1,
          yref: "y",
          y0: yValue1,
          y1: yValue1,
          line: {
            color: "rgba(255, 0, 0,1)",
            width: 2,
            dash: "dashdot",
          },
        });

        // Tambahkan garis horizontal kedua pada layoutTomorrow.shapes
        layoutTomorrow.shapes.push({
          type: "line",
          xref: "paper",
          x0: 0,
          x1: 1,
          yref: "y",
          y0: yValue2,
          y1: yValue2,
          line: {
            color: "rgba(255, 0, 0,1)",
            width: 2,
            dash: "dashdot",
          },
        });
        layoutTomorrow.shapes.push({
          type: "line",
          xref: "paper",
          x0: 0,
          x1: 1,
          yref: "y",
          y0: yValue3,
          y1: yValue3,
          line: {
            color: "rgba(242, 120, 0,1)",
            width: 2,
            dash: "dashdot",
          },
        });
        layoutTomorrow.shapes.push({
          type: "line",
          xref: "paper",
          x0: 0,
          x1: 1,
          yref: "y",
          y0: yValue4,
          y1: yValue4,
          line: {
            color: "rgba(242, 120, 0,1)",
            width: 2,
            dash: "dashdot",
          },
        });
      }

      // Update plot dengan layout yang sudah diperbarui
      Plotly.update("tomorrow", null, layoutTomorrow);
    }

    function jam11() {
      if (hasilpip !== 0) {
        risk = parseFloat(closepip / hasilpip).toFixed(2);
      } else if (closepip !== 0) {
        risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
      } else {
        risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
      }
      equity = parseFloat(equity * (risk / 100) + equity);
      updateTable(
        tab,
        day,
        formattedDate,
        time,
        highestHigh,
        lowestLow,
        range,
        vlm,
        letter,
        trend,
        setup,
        order,
        entry,
        lossvalue,
        hasilpip,
        closesetup,
        closeprice,
        closepip,
        risk,

        equity
      );
    }
    abonoff();
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
    var tscount = 0;
    var counter = 0;
    var tab = 0;
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
    var stop_lossab = [];
    var stoploss = [];
    var stoplossab = [];
    var trail_stop = false;
    var trail_count = 0;
    var trailmode = false;
    var bep = [];
    var bepab = [];
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
    var bupa = 0;
    var bupb = 0;
    var bdowna = 0;
    var bdownb = 0;
    var cupa = 0;
    var cupb = 0;
    var cdowna = 0;
    var cdownb = 0;
    var cond1 = false;
    var cond2 = false;
    var cond3 = false;
    var sella = false;
    var sellb = false;
    var buya = false;
    var buyb = false;
    var abcount = 0;
    var risk = 0;
    for (var i = 0; i < tomorrowsimulation.length; i++) {
      var minute = tomorrowsimulation[i].Date;
      var day = minute.toLocaleString("en-us", { weekday: "short" });
      var formattedDate = minute.toLocaleString("en-us", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
      var time = minute.toLocaleString("en-us", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      });
      var open_value = parseFloat(tomorrowsimulation[i].Open).toFixed(2);
      var low_value = parseFloat(tomorrowsimulation[i].Low).toFixed(2);
      var high_value = parseFloat(tomorrowsimulation[i].High).toFixed(2);
      var close_value = parseFloat(tomorrowsimulation[i].Close).toFixed(2);
      var vol = parseFloat(tomorrowsimulation[i].Volume).toFixed(2);
      var first_next = parseFloat(tomorrowsimulation[0].Open).toFixed(2);
      // console.log(
      //   `Minute: ${minute}, Open: ${open_value}, High: ${high_value}, Low: ${low_value}, Volume: ${vol}`
      // );
      console.log(`Day = ${day}, Date = ${formattedDate}, Time = ${time}`);
      if (abcount == 2) {
        ab = false;
      }
      if (lowestLowIndex < highestHighIndex) {
        console.log("UPTREND");
        uptrend = true;
        var trend = "UP";
        // addParagraphToAnalisa(`UPTREND`);
        if (fibo61 <= first_next && first_next <= fibo23) {
          var letter = "A";
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
            lossvalue = stoploss;
            if (
              (open_value <= stoploss ||
                low_value <= stoploss ||
                high_value <= stoploss) &&
              buy
            ) {
              lossvalue = stoploss;
              hasilpip = pipbuy;
              buy = false;
              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = false;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   simulasi(`STOP LOSS : ${stoploss}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(stoploss - buystop).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
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
                  risk = 0;
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
                var closesetup = `TS.${tscount}`;
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
              // disini
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
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
              hasilpip = pipsell;
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                //  else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   simulasi(`STOP LOSS : ${stoploss}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(sellstop - stoploss).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
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
                  risk = 0;
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
                var closesetup = `TS.${tscount}`;
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
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
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
            (((a2a >= open_value && open_value >= a2b) ||
              (a2a >= high_value && high_value >= a2b) ||
              (a2a >= low_value && low_value >= a2b)) &&
              onlya) ||
            !onlya
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
              if (checkab) {
                ab = true;
              }
            }
            if (setopen) {
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
                  setup = "A2";
                  var pipsell = parseFloat(buystop - sellstop).toFixed(2);
                  if (!invers) {
                    ab = true;
                  } else {
                    ab = false;
                  }
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
                  setup = "A1";
                  buy = true;
                  sell = false;
                  counter = counter + 1;
                  buy_stop = false;
                  sellstop = a2b;
                  stoploss = sellstop;
                  sell_stop = true;
                  var pipbuy = parseFloat(buystop - sellstop).toFixed(2);
                  // if (!invers) {
                  //   ab = false;
                  // } else {
                  //   ab = true;
                  // }
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
                    tscount = 7;
                  } else if (tp6b) {
                    stoploss = a2atp4;
                    tscount = 6;
                  } else if (tp5b) {
                    stoploss = a2atp3;
                    tscount = 5;
                  } else if (tp4b) {
                    stoploss = a2atp2;
                    tscount = 4;
                  } else if (tp3b) {
                    stoploss = a2atp1;
                    tscount = 3;
                  } else if (tp2b) {
                    stoploss = a2atp;
                    tscount = 2;
                  } else if (tp1b) {
                    stoploss = a2atp;
                    tscount = 1;
                  }
                }
                if (bepa) {
                  if (
                    (open_value >= fibo23 ||
                      low_value >= fibo23 ||
                      high_value >= fibo23) &&
                    !bep
                  ) {
                    bep = true;
                    stoploss = sellstop;
                  }
                }
                if (!bepa) {
                  if (
                    (open_value >= fibo0 ||
                      low_value >= fibo0 ||
                      high_value >= fibo0) &&
                    !bep
                  ) {
                    bep = true;
                    stoploss = sellstop;
                  }
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
                    tscount = 7;
                  } else if (tp6s) {
                    stoploss = a2btp4;
                    tscount = 6;
                  } else if (tp5s) {
                    stoploss = a2btp3;
                    tscount = 5;
                  } else if (tp4s) {
                    stoploss = a2btp2;
                    tscount = 4;
                  } else if (tp3s) {
                    stoploss = a2btp1;
                    tscount = 3;
                  } else if (tp2s) {
                    stoploss = a2btp;
                    tscount = 2;
                  } else if (tp1s) {
                    stoploss = a2btp;
                    tscount = 1;
                  }
                }
                if (bepa) {
                  if (
                    (open_value <= fibo78 ||
                      low_value <= fibo78 ||
                      high_value <= fibo78) &&
                    !bep
                  ) {
                    bep = true;
                    stoploss = sellstop;
                  }
                }
                if (!bepa) {
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
              hasilpip = pipbuy;
              lossvalue = sellstop;
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            } else if (sell) {
              hasil = parseFloat(entry - open_value).toFixed(2);
              hasilpip = pipsell;
              lossvalue = buystop;
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            break;
          }
        } else if (fibo23 <= first_next && first_next <= fibo0) {
          var letter = "B";
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
          if (invers) {
            bupa = parseFloat(
              ((fibo0 + fibo23) / 2 + keypip + sphread).toFixed(2)
            );
            bupb = parseFloat((fibo23 + keypip + sphread).toFixed(2));
          } else {
            bupa = parseFloat(((fibo0 + fibo23) / 2 - keypip).toFixed(2));
            bupb = parseFloat((fibo0 - keypip).toFixed(2));
            console.log(`bupa = ${bupa} bupb = ${bupb}`);
          }
          if (invers) {
            if (first_next >= bupa) {
              cond1 = true;
            } else if (first_next <= bupa && first_next >= bupb) {
              cond2 = true;
            } else if (first_next <= bupb) {
              cond3 = true;
            }
          } else if (!invers) {
            if (first_next >= bupb) {
              cond1 = true;
            } else if (first_next <= bupb && first_next >= bupa) {
              cond2 = true;
            } else if (first_next <= bupa) {
              cond3 = true;
            }
          }
          if (!invers && ab) {
            if (abcount < 3) {
              if (!sella || !sellb) {
                if (cond1) {
                  if (
                    (open_value <= bupb ||
                      low_value <= bupb ||
                      high_value <= bupb) &&
                    !sellb &&
                    !sella
                  ) {
                    abcount = abcount + 1;
                    sellb = true;
                    simulasi(`SELL 1B in ${minute}`);
                    console.log(`SELL B in ${minute}`);
                    stop_lossab[abcount] = false;
                    var entry2 = bupb;
                    stoplossab[abcount] = buystop;
                    bepab[abcount] = false;
                  }
                  if (
                    (open_value <= bupa ||
                      low_value <= bupa ||
                      high_value <= bupa) &&
                    !sella
                  ) {
                    abcount = abcount + 1;
                    sella = true;
                    simulasi(`SELL 1A in ${minute}`);
                    console.log(`SELL A in ${minute}`);
                    stop_lossab[abcount] = false;
                    var entry3 = bupa;
                    stoplossab[abcount] = buystop;
                    bepab[abcount] = false;
                  }
                } else if (cond2) {
                  if (
                    (open_value >= bupb ||
                      low_value >= bupb ||
                      high_value >= bupb) &&
                    !sellb &&
                    !sella
                  ) {
                    abcount = abcount + 1;
                    sellb = true;
                    simulasi(`SELL 2B in ${minute}`);
                    console.log(`SELL B in ${minute}`);
                    stop_lossab[abcount] = false;
                    var entry2 = bupb;
                    stoplossab[abcount] = buystop;
                    bepab[abcount] = false;
                  }
                  if (
                    (open_value <= bupa ||
                      low_value <= bupa ||
                      high_value <= bupa) &&
                    sellb &&
                    !sella
                  ) {
                    abcount = abcount + 1;
                    sella = true;
                    simulasi(`SELL 2A in ${minute}`);
                    console.log(`SELL A in ${minute}`);
                    stop_lossab[abcount] = false;
                    var entry3 = bupa;
                    stoplossab[abcount] = buystop;
                    bepab[abcount] = false;
                  }
                  if (
                    (open_value <= bupa ||
                      low_value <= bupa ||
                      high_value <= bupa) &&
                    !sella &&
                    !sellb
                  ) {
                    abcount = abcount + 1;
                    sella = true;
                    simulasi(`SELL 2A in ${minute}`);
                    console.log(`SELL A in ${minute}`);
                    stop_lossab[abcount] = false;
                    var entry2 = bupa;
                    stoplossab[abcount] = buystop;
                    bepab[abcount] = false;
                  }
                  if (
                    (open_value >= bupb ||
                      low_value >= bupb ||
                      high_value >= bupb) &&
                    sella &&
                    !sellb
                  ) {
                    abcount = abcount + 1;
                    sellb = true;
                    simulasi(`SELL 2B in ${minute}`);
                    console.log(`SELL B in ${minute}`);
                    stop_lossab[abcount] = false;
                    var entry3 = bupb;
                    stoplossab[abcount] = buystop;
                    bepab[abcount] = false;
                  }
                }
                if (cond3) {
                  if (
                    (open_value >= bupa ||
                      low_value >= bupa ||
                      high_value >= bupa) &&
                    !sella
                  ) {
                    abcount = abcount + 1;
                    sella = true;
                    simulasi(`SELL 3A in ${minute}`);
                    console.log(`SELL A in ${minute}`);
                    stop_lossab[abcount] = false;
                    var entry3 = bupa;
                    stoplossab[abcount] = buystop;
                    bepab[abcount] = false;
                  }
                  if (
                    (open_value >= bupb ||
                      low_value >= bupb ||
                      high_value >= bupb) &&
                    !sellb
                  ) {
                    abcount = abcount + 1;
                    sellb = true;
                    simulasi(`SELL 3B in ${minute}`);
                    console.log(`SELL B in ${minute}`);
                    stop_lossab[abcount] = false;
                    var entry2 = bupb;
                    stoplossab[abcount] = buystop;
                    bepab[abcount] = false;
                  }
                }
              }
              var pipsella = parseFloat(buystop - bupa).toFixed(2);
              var pipsellb = parseFloat(buystop - bupb).toFixed(2);
            }
          }

          if (invers && ab) {
            if (abcount < 3) {
              if (!buya || !buyb) {
                if (cond1) {
                  if (
                    (open_value <= bupb ||
                      low_value <= bupb ||
                      high_value <= bupb) &&
                    !buyb
                  ) {
                    abcount = abcount + 1;
                    buyb = true;
                    simulasi(`BUY 1B in ${minute}`);
                    console.log(`BUY 1B in ${minute}`);
                    stop_lossab[abcount] = false;
                    var order = "Buy Limit";
                    var entry3 = bupb;
                    stoplossab[abcount] = sellstop;
                    bepab[abcount] = false;
                    // var hasilpip = parseFloat(  stoplossab[abcount] - entry2).toFixed(2);
                  }
                  if (
                    (open_value <= bupa ||
                      low_value <= bupa ||
                      high_value <= bupa) &&
                    !buya
                  ) {
                    abcount = abcount + 1;
                    buya = true;
                    simulasi(`BUY 1A in ${minute}`);
                    console.log(`BUY 1A in ${minute}`);
                    stop_lossab[abcount] = false;
                    var order = "Buy Limit";
                    var entry2 = bupa;
                    stoplossab[abcount] = sellstop;
                    bepab[abcount] = false;
                    // var hasilpip = parseFloat(  stoplossab[abcount] - entry2).toFixed(2);
                  }
                } else if (cond2) {
                  if (
                    (open_value >= bupa ||
                      low_value >= bupa ||
                      high_value >= bupa) &&
                    !buyb &&
                    !buya
                  ) {
                    abcount = abcount + 1;
                    buya = true;
                    buyb = false;
                    simulasi(`BUY 2A in ${minute}`);
                    console.log(`BUY 2A in ${minute}`);
                    stop_lossab[abcount] = false;
                    var order = "Buy Stop";
                    var entry2 = bupa;
                    stoplossab[abcount] = sellstop;
                    bepab[abcount] = false;
                    // var hasilpip = parseFloat(  stoplossab[abcount] - entry2).toFixed(2);
                  }
                  if (
                    (open_value <= bupb ||
                      low_value <= bupb ||
                      high_value <= bupb) &&
                    buya &&
                    !buyb
                  ) {
                    abcount = abcount + 1;
                    buyb = true;
                    simulasi(`BUY 2B in ${minute}`);
                    console.log(`BUY 2B in ${minute}`);
                    stop_lossab[abcount] = false;
                    var order = "Buy Limit";
                    var entry3 = bupb;
                    stoplossab[abcount] = sellstop;
                    bepab[abcount] = false;
                    // var hasilpip = parseFloat(  stoplossab[abcount] - entry2).toFixed(2);
                  }
                  if (
                    (open_value <= bupb ||
                      low_value <= bupb ||
                      high_value <= bupb) &&
                    !buya &&
                    !buyb
                  ) {
                    abcount = abcount + 1;
                    buyb = true;
                    buya = false;
                    simulasi(`BUY 2B in ${minute}`);
                    console.log(`BUY 2B in ${minute}`);
                    stop_lossab[abcount] = false;
                    var order = "Buy Limit";
                    var entry2 = bupb;
                    stoplossab[abcount] = sellstop;
                    bepab[abcount] = false;
                    // var hasilpip = parseFloat(  stoplossab[abcount] - entry2).toFixed(2);
                  }
                  if (
                    (open_value >= bupa ||
                      low_value >= bupa ||
                      high_value >= bupa) &&
                    buyb &&
                    !buya
                  ) {
                    abcount = abcount + 1;
                    buya = true;
                    simulasi(`BUY 2A in ${minute}`);
                    console.log(`BUY 2A in ${minute}`);
                    stop_lossab[abcount] = false;
                    var order = "Buy Stop";
                    var entry3 = bupa;
                    stoplossab[abcount] = sellstop;
                    bepab[abcount] = false;
                    // var hasilpip = parseFloat(  stoplossab[abcount] - entry2).toFixed(2);
                  }
                }
                if (cond3) {
                  if (
                    (open_value >= bupb ||
                      low_value >= bupb ||
                      high_value >= bupb) &&
                    !buyb
                  ) {
                    abcount = abcount + 1;
                    buyb = true;
                    simulasi(`BUY 3A in ${minute}`);
                    console.log(`BUY 3A in ${minute}`);
                    stop_lossab[abcount] = false;
                    var order = "Buy Stop";
                    var entry3 = bupb;
                    stoplossab[abcount] = sellstop;
                    bepab[abcount] = false;
                    // var hasilpip = parseFloat(  stoplossab[abcount] - entry2).toFixed(2);
                  }
                  if (
                    (open_value >= bupa ||
                      low_value >= bupa ||
                      high_value >= bupa) &&
                    !buya
                  ) {
                    abcount = abcount + 1;
                    buya = true;
                    simulasi(`BUY 3B in ${minute}`);
                    console.log(`BUY 3B in ${minute}`);
                    stop_lossab[abcount] = false;
                    var order = "Buy Stop";
                    var entry2 = bupa;
                    stoplossab[abcount] = sellstop;
                    bepab[abcount] = false;
                    // var hasilpip = parseFloat(  stoplossab[abcount] - entry2).toFixed(2);
                  }
                }
              }
              var pipbuya = parseFloat(bupa - sellstop).toFixed(2);
              var pipbuyb = parseFloat(bupb - sellstop).toFixed(2);
            }
          }

          if (!stop_loss) {
            if (
              (open_value <= stoploss[counter] ||
                low_value <= stoploss[counter] ||
                high_value <= stoploss[counter]) &&
              buy
            ) {
              lossvalue = parseFloat(sellstop).toFixed(2);
              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = false;
                  hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   simulasi(`STOP LOSS : ${stoploss[counter]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bep[counter] &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = false;
                  bep[counter] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  hasil = 0;
                  //
                  var hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss[counter]}`);
                hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss[counter]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);

              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
            }
            if (
              (open_value <= stoploss[counter] ||
                low_value <= stoploss[counter] ||
                high_value <= stoploss[counter]) &&
              buy
            ) {
              setup = "B1.c";
              order = "Buy Stop";
              hasilpip = pipbuy;
              risk = buy = false;
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value >= stoploss[counter] ||
                low_value >= stoploss[counter] ||
                high_value >= stoploss[counter]) &&
              sell
            ) {
              console.log(`${stoploss}`);
              lossvalue = parseFloat(buystop).toFixed(2);
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                  sell_stop = false;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   simulasi(`STOP LOSS : ${stoploss[counter]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bep[counter] &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss[counter]}`);
                  sell_stop = false;
                  buy_stop = true;
                  bep[counter] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  var hasil = 0;
                  // var //
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss[counter]}`);
                hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }

              var closeprice = parseFloat(stoploss[counter]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              console.log(`cp ${closeprice} cpip ${closepip}`);
            }
            if (
              (open_value >= stoploss[counter] ||
                low_value >= stoploss[counter] ||
                high_value >= stoploss[counter]) &&
              sell
            ) {
              hasilpip = pipsell;
              sell = false;
              var setup = "B1.d";
              var order = "Sell Stop";
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              equity = parseFloat(equity * (risk / 100) + equity);
              tab = tab + 1;
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
          }
          if (!stop_lossab[abcount]) {
            if (
              (open_value <= stoplossab[abcount] ||
                low_value <= stoplossab[abcount] ||
                high_value <= stoplossab[abcount]) &&
              (buya || buyb)
            ) {
              lossvalue = parseFloat(sellstop).toFixed(2);
              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_lossab[abcount] = true;
                  simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = false;
                  hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_lossab[abcount] = true;
                //   simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bepab[abcount] &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_lossab[abcount] = true;
                  simulasi(`BEP AT : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = false;
                  bepab[abcount] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  hasil = 0;
                  //
                  var hasil = 0;
                } else {
                  stop_lossab[abcount] = true;
                  simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_lossab[abcount] = true;
                simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_lossab[abcount] = true;
                simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);

              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
            }
            if (
              (open_value <= stoplossab[abcount] ||
                low_value <= stoplossab[abcount] ||
                high_value <= stoplossab[abcount]) &&
              buya
            ) {
              var setup = "B1.a";
              var entry = bupa;
              hasilpip = pipbuya;
              var buya = false;
              var ab = false;
              //  ;
              var hasil = stoplossab[abcount] - bupa;
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Buy Limit";
              } else if (cond2) {
                var order = "Buy Stop";
              } else if (cond3) {
                var order = "Buy Stop";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value <= stoplossab[abcount] ||
                low_value <= stoplossab[abcount] ||
                high_value <= stoplossab[abcount]) &&
              buyb
            ) {
              var setup = "B1.b";
              var entry = bupb;
              var hasilpip = pipbuyb;
              var hasil = stoplossab[abcount] - bupb;
              var buyb = false;
              var ab = false;
              //  ;
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Buy Limit";
              } else if (cond2) {
                var order = "Buy Limit";
              } else if (cond3) {
                var order = "Buy Stop";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value >= stoplossab[abcount] ||
                low_value >= stoplossab[abcount] ||
                high_value >= stoplossab[abcount]) &&
              (sella || sellb)
            ) {
              lossvalue = parseFloat(buystop).toFixed(2);
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_lossab[abcount] = true;
                  simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                  sell_stop = false;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_lossab[abcount] = true;
                //   simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bepab[abcount] &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_lossab[abcount] = true;
                  simulasi(`BEP AT : ${stoplossab[abcount]}`);
                  sell_stop = false;
                  buy_stop = true;
                  bepab[abcount] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  var hasil = 0;
                  // var //
                } else {
                  stop_lossab[abcount] = true;
                  simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_lossab[abcount] = true;
                simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_lossab[abcount] = true;
                simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }

              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
            }
            if (
              (open_value >= stoplossab[abcount] ||
                low_value >= stoplossab[abcount] ||
                high_value >= stoplossab[abcount]) &&
              sella
            ) {
              hasilpip = pipsella;
              setup = "B1.a";
              sella = false;
              ab = false;
              //  ;
              var entry = bupa;
              var hasil = bupa - stoplossab[abcount];
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Stop";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value >= stoplossab[abcount] ||
                low_value >= stoplossab[abcount] ||
                high_value >= stoplossab[abcount]) &&
              sellb
            ) {
              hasilpip = pipsellb;
              entry = bupb;
              setup = "B1.b";
              //  ;
              sellb = false;
              ab = false;
              var hasil = bupb - stoplossab[abcount];
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Limit";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
          }
          if (b2d >= open_value && open_value >= b2c && !onlya) {
            if (!setopen) {
              if (checkab) {
                ab = true;
              }
              sellstop = b2c;
              simulasi(`SELL STOP : ${sellstop}`);
              sell_stop = true;
              buystop = b2d;
              simulasi(`BUY STOP : ${buystop}`);
              buy_stop = true;
              setopen = true;
            }
          }
          if (setopen) {
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
                stoploss[counter] = buystop;
                var lossvalue = stoploss[counter];
                bep[counter] = false;
                var pipsell = parseFloat(buystop - sellstop).toFixed(2);
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

                var entry = buystop;
                simulasi(`BUY STOP AT: ${buystop} in ${minute}`);
                sell = false;
                buy = true;
                counter = counter + 1;
                sell_stop = true;
                buy_stop = false;
                stoploss[counter] = sellstop;
                var lossvalue = stoploss[counter];
                bep[counter] = false;
                var pipbuy = parseFloat(buystop - sellstop).toFixed(2);

                //
                // simulasi(`${entry} + ${  stoploss[counter]} + ${hasilpip}`);
              }
            }
          }

          if (sell || sella || sellb) {
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
                stoploss[counter] = b2tp5;
                stoplossab[abcount] = b2tp5;
                tscount = 7;
              } else if (tp6s) {
                stoploss[counter] = b2tp4;
                stoplossab[abcount] = b2tp4;
                tscount = 6;
              } else if (tp5s) {
                stoploss[counter] = b2tp3;
                stoplossab[abcount] = b2tp3;
                tscount = 5;
              } else if (tp4s) {
                stoploss[counter] = b2tp2;
                stoplossab[abcount] = b2tp2;
                tscount = 4;
              } else if (tp3s) {
                stoploss[counter] = b2tp1;
                stoplossab[abcount] = b2tp1;
                tscount = 3;
              } else if (tp2s) {
                stoploss[counter] = b2tp;
                stoplossab[abcount] = b2tp;
                tscount = 2;
              } else if (tp1s) {
                stoploss[counter] = b2tp;
                stoplossab[abcount] = b2tp;
                tscount = 1;
              }
            } else if (
              (open_value <= fibo61 ||
                low_value <= fibo61 ||
                high_value <= fibo61) &&
              !tp1s &&
              !tp2s &&
              !tp3s &&
              !tp4s &&
              !tp5s &&
              !tp6s &&
              !tp7s &&
              (!bepab[abcount] || !bep[counter])
            ) {
              bep[counter] = true;
              bepab[counter] = true;
              stoploss[counter] = sellstop;
              stoplossab[abcount] = sellstop;
            }
          } else if (buy || buya || buyb) {
            if (
              open_value >= tsbuy ||
              low_value >= tsbuy ||
              high_value >= tsbuy
            ) {
              simulasi("MASUK");
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
                stoploss[counter] = ts5;
                stoplossab[abcount] = ts5;
                tscount = 7;
              } else if (tp6b) {
                stoploss[counter] = ts4;
                stoplossab[abcount] = ts4;
                tscount = 6;
              } else if (tp5b) {
                stoploss[counter] = ts3;
                stoplossab[abcount] = ts3;
                tscount = 5;
              } else if (tp4b) {
                stoploss[counter] = ts2;
                stoplossab[abcount] = ts2;
                tscount = 4;
              } else if (tp3b) {
                stoploss[counter] = ts1;
                stoplossab[abcount] = ts1;
                tscount = 3;
              } else if (tp2b) {
                stoploss[counter] = ts;
                stoplossab[abcount] = ts;
                tscount = 2;
              } else if (tp1b) {
                stoploss[counter] = ts;
                stoplossab[abcount] = ts;
                tscount = 1;
              }
            } else if (
              (open_value >= bepbuy ||
                low_value >= bepbuy ||
                high_value >= bepbuy) &&
              !tp1b &&
              !tp2b &&
              !tp3b &&
              !tp4b &&
              !tp5b &&
              !tp6b &&
              !tp7b &&
              (!bepab[abcount] || !bep[counter])
            ) {
              bep[counter] = true;
              bepab[abcount] = true;
              stoploss[counter] = buystop;
              stoplossab[abcount] = buystop;
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
            if (buy) {
              setup = "B1.c";
              hasil = parseFloat(open_value - buystop).toFixed(2);
              hasilpip = pipbuy;
              lossvalue = sellstop;
              var order = "Buy Stop";
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (buya) {
              setup = "B1.a";
              hasil = parseFloat(open_value - bupa).toFixed(2);
              lossvalue = sellstop;
              hasilpip = pipbuya;
              simulasi(`Buy B Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Buy Stop";
              } else if (cond2) {
                var order = "Buy Stop";
              } else if (cond3) {
                var order = "Buy Limit";
              }
              var entry = bupa;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (buyb) {
              setup = "B1.b";
              hasil = parseFloat(open_value - bupb).toFixed(2);
              lossvalue = sellstop;
              hasilpip = pipbuyb;
              simulasi(`Buy B Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Buy Stop";
              } else if (cond2) {
                var order = "Buy Stop";
              } else if (cond3) {
                var order = "Buy Limit";
              }
              var entry = bupb;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (sell) {
              setup = "B1.d";
              hasilpip = pipsell;
              hasil = parseFloat(sellstop - open_value).toFixed(2);
              var order = "Sell Stop";
              lossvalue = buystop;
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (sella) {
              setup = "B1.a";
              hasilpip = pipsella;
              hasil = parseFloat(bupa - open_value).toFixed(2);
              lossvalue = buystop;
              simulasi(`Sell A Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Stop";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              var entry = bupa;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (sellb) {
              setup = "B1.b";
              hasilpip = pipsella;
              hasil = parseFloat(bupb - open_value).toFixed(2);
              lossvalue = buystop;
              simulasi(`Sell B Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Limit";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              var entry = bupb;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }

            break;
          }
        } else if (fibo100 <= first_next && first_next <= fibo61) {
          // addParagraphToAnalisa(`OPEN C`);
          // console.log("OPEN C");
          var letter = "C";
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
          selisihts = fibo0 - c2d;
          tssell = c2c - selisihts;
          bepsell = tssell + selisihbep;
          if (invers) {
            cupa = parseFloat(((fibo61 + fibo100) / 2 - keypip).toFixed(2));
            cupb = parseFloat((fibo61 - keypip).toFixed(2));
          } else {
            cupa = parseFloat(
              ((fibo61 + fibo100) / 2 + keypip + sphread).toFixed(2)
            );
            cupb = parseFloat((fibo100 + keypip + sphread).toFixed(2));
            console.log(`cupa = ${cupa} cupb = ${cupb}`);
          }
          if (invers) {
            if (first_next >= cupb) {
              cond1 = true;
            } else if (first_next <= cupb && first_next >= cupa) {
              cond2 = true;
            } else if (first_next <= cupa) {
              cond3 = true;
            }
          } else if (!invers) {
            if (first_next >= cupa) {
              cond1 = true;
            } else if (first_next <= cupa && first_next >= cupb) {
              cond2 = true;
            } else if (first_next <= cupb) {
              cond3 = true;
            }
          }
          if (!invers && ab) {
            if (!buya || !buyb) {
              if (cond1) {
                if (
                  (open_value <= bupb ||
                    low_value <= bupb ||
                    high_value <= bupb) &&
                  !buyb
                ) {
                  abcount = abcount + 1;
                  buyb = true;
                  simulasi(`BUY 1B in ${minute}`);
                  console.log(`BUY 1B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Limit";
                  var entry2 = cupb;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value <= cupa ||
                    low_value <= cupa ||
                    high_value <= cupa) &&
                  !buya
                ) {
                  abcount = abcount + 1;
                  buya = true;
                  simulasi(`BUY 1A in ${minute}`);
                  console.log(`BUY 1A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Limit";
                  var entry3 = cupa;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
              } else if (cond2) {
                if (
                  (open_value >= cupa ||
                    low_value >= cupa ||
                    high_value >= cupa) &&
                  !buyb &&
                  !buya
                ) {
                  abcount = abcount + 1;
                  buya = true;
                  buyb = false;
                  simulasi(`BUY 2A in ${minute}`);
                  console.log(`BUY 2A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Stop";
                  var entry3 = cupa;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value <= cupb ||
                    low_value <= cupb ||
                    high_value <= cupb) &&
                  buya &&
                  !buyb
                ) {
                  abcount = abcount + 1;
                  buyb = true;
                  simulasi(`BUY 2B in ${minute}`);
                  console.log(`BUY 2B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Limit";
                  var entry2 = cupb;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value <= cupb ||
                    low_value <= cupb ||
                    high_value <= cupb) &&
                  !buya &&
                  !buyb
                ) {
                  abcount = abcount + 1;
                  buyb = true;
                  buya = false;
                  simulasi(`BUY 2B in ${minute}`);
                  console.log(`BUY 2B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Limit";
                  var entry3 = cupb;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value >= cupa ||
                    low_value >= cupa ||
                    high_value >= cupa) &&
                  buyb &&
                  !buya
                ) {
                  abcount = abcount + 1;
                  buya = true;
                  simulasi(`BUY 2A in ${minute}`);
                  console.log(`BUY 2A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Stop";
                  var entry2 = cupa;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
              }
              if (cond3) {
                if (
                  (open_value >= cupb ||
                    low_value >= cupb ||
                    high_value >= cupb) &&
                  !buyb
                ) {
                  abcount = abcount + 1;
                  buyb = true;
                  simulasi(`BUY 3A in ${minute}`);
                  console.log(`BUY 3A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Stop";
                  var entry3 = cupb;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value >= cupa ||
                    low_value >= cupa ||
                    high_value >= cupa) &&
                  !buya
                ) {
                  abcount = abcount + 1;
                  buya = true;
                  simulasi(`BUY 3B in ${minute}`);
                  console.log(`BUY 3B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Stop";
                  var entry2 = cupa;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
              }
            }
            pipbuya = parseFloat(cupa - sellstop).toFixed(2);
            pipbuyb = parseFloat(cupb - sellstop).toFixed(2);
          }
          if (invers && ab) {
            if (!sella || !sellb) {
              if (cond1) {
                if (
                  (open_value <= cupb ||
                    low_value <= cupb ||
                    high_value <= cupb) &&
                  !sellb
                ) {
                  abcount = abcount + 1;
                  sellb = true;
                  simulasi(`SELL 1B in ${minute}`);
                  console.log(`SELL B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Stop";
                  var entry2 = cupb;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value <= cupa ||
                    low_value <= cupa ||
                    high_value <= cupa) &&
                  !sella
                ) {
                  abcount = abcount + 1;
                  sella = true;
                  simulasi(`SELL 1A in ${minute}`);
                  console.log(`SELL A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Stop";
                  var entry3 = cupa;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
              } else if (cond2) {
                if (
                  (open_value >= cupb ||
                    low_value >= cupb ||
                    high_value >= cupb) &&
                  !sellb &&
                  !sella
                ) {
                  abcount = abcount + 1;
                  sellb = true;
                  simulasi(`SELL 2B in ${minute}`);
                  console.log(`SELL B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Stop";
                  var entry2 = cupb;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value <= cupa ||
                    low_value <= cupa ||
                    high_value <= cupa) &&
                  sellb &&
                  !sella
                ) {
                  abcount = abcount + 1;
                  sella = true;
                  simulasi(`SELL 2A in ${minute}`);
                  console.log(`SELL A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Limit";
                  var entry3 = cupa;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value <= cupa ||
                    low_value <= cupa ||
                    high_value <= cupa) &&
                  !sella &&
                  !sellb
                ) {
                  abcount = abcount + 1;
                  sella = true;
                  simulasi(`SELL 2A in ${minute}`);
                  console.log(`SELL A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Limit";
                  var entry3 = cupa;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value >= cupb ||
                    low_value >= cupb ||
                    high_value >= cupb) &&
                  sella &&
                  !sellb
                ) {
                  abcount = abcount + 1;
                  sellb = true;
                  simulasi(`SELL 2B in ${minute}`);
                  console.log(`SELL B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Stop";
                  var entry2 = cupb;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
              }
              if (cond3) {
                if (
                  (open_value >= cupa ||
                    low_value >= cupa ||
                    high_value >= cupa) &&
                  !sella
                ) {
                  abcount = abcount + 1;
                  sella = true;
                  simulasi(`SELL 3A in ${minute}`);
                  console.log(`SELL A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Limit";
                  var entry2 = cupa;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value >= cupb ||
                    low_value >= cupb ||
                    high_value >= cupb) &&
                  !sellb
                ) {
                  abcount = abcount + 1;
                  sellb = true;
                  simulasi(`SELL 3B in ${minute}`);
                  console.log(`SELL B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Limit";
                  var entry3 = cupb;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
              }
            }
            pipsella = parseFloat(buystop - cupa).toFixed(2);
            pipsellb = parseFloat(buystop - cupb).toFixed(2);
          }
          if (!stop_loss) {
            if (
              (open_value <= stoploss[counter] ||
                low_value <= stoploss[counter] ||
                high_value <= stoploss[counter]) &&
              buy
            ) {
              lossvalue = parseFloat(sellstop).toFixed(2);
              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = false;
                  hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   simulasi(`STOP LOSS : ${stoploss[counter]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bep[counter] &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = false;
                  bep[counter] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss[counter]}`);
                hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss[counter]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);

              // if (hasilpip !== 0) {
              //   risk = parseFloat(closepip / hasilpip).toFixed(2);
              // } else if (closepip !== 0) {
              //   risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              // } else {
              //   risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              // }
            }
            if (
              (open_value <= stoploss[counter] ||
                low_value <= stoploss[counter] ||
                high_value <= stoploss[counter]) &&
              buy
            ) {
              setup = "C1.c";
              order = "Buy Stop";
              hasilpip = pipbuy;
              buy = false;
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value >= stoploss[counter] ||
                low_value >= stoploss[counter] ||
                high_value >= stoploss[counter]) &&
              sell
            ) {
              lossvalue = parseFloat(buystop).toFixed(2);
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                  sell_stop = false;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss[counter]);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                  //
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   simulasi(`STOP LOSS : ${stoploss[counter]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bep[counter] &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss[counter]}`);
                  sell_stop = false;
                  buy_stop = true;
                  bep[counter] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  var hasil = 0;
                  //
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss[counter]}`);
                hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss[counter]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
            }
            if (
              (open_value >= stoploss[counter] ||
                low_value >= stoploss[counter] ||
                high_value >= stoploss[counter]) &&
              sell
            ) {
              sell = false;
              var setup = "C1.d";
              var order = "Sell Stop";
              hasilpip = pipsell;
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
          }
          if (!stop_lossab[abcount]) {
            if (
              (open_value <= stoplossab[abcount] ||
                low_value <= stoplossab[abcount] ||
                high_value <= stoplossab[abcount]) &&
              (buya || buyb)
            ) {
              lossvalue = parseFloat(sellstop).toFixed(2);
              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_lossab[abcount] = true;
                  simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = false;
                  hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_lossab[abcount] = true;
                //   simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bepab[abcount] &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_lossab[abcount] = true;
                  simulasi(`BEP AT : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = false;
                  bepab[abcount] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  hasil = 0;
                } else {
                  stop_lossab[abcount] = true;
                  simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_lossab[abcount] = true;
                simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_lossab[abcount] = true;
                simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);

              // if (hasilpip !== 0) {
              //   risk = parseFloat(closepip / hasilpip).toFixed(2);
              // } else if (closepip !== 0) {
              //   risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              // } else {
              //   risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              // }
            }
            if (
              (open_value <= stoplossab[abcount] ||
                low_value <= stoplossab[abcount] ||
                high_value <= stoplossab[abcount]) &&
              buya
            ) {
              var setup = "C1.a";
              var entry = cupa;
              hasilpip = pipbuya;
              var buya = false;
              var ab = false;
              var hasil = stoplossab[abcount] - cupa;
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Buy Limit";
              } else if (cond2) {
                var order = "Buy Stop";
              } else if (cond3) {
                var order = "Buy Stop";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value <= stoplossab[abcount] ||
                low_value <= stoplossab[abcount] ||
                high_value <= stoplossab[abcount]) &&
              buyb
            ) {
              var setup = "C1.b";
              var entry = cupb;
              var hasilpip = pipbuyb;
              var hasil = stoplossab[abcount] - cupb;
              var buyb = false;
              var ab = false;
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Buy Limit";
              } else if (cond2) {
                var order = "Buy Limit";
              } else if (cond3) {
                var order = "Buy Stop";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value >= stoplossab[abcount] ||
                low_value >= stoplossab[abcount] ||
                high_value >= stoplossab[abcount]) &&
              (sella || sellb)
            ) {
              lossvalue = parseFloat(buystop).toFixed(2);
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_lossab[abcount] = true;
                  simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                  sell_stop = false;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoplossab[abcount]);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                  //
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_lossab[abcount] = true;
                //   simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bepab[abcount] &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_lossab[abcount] = true;
                  simulasi(`BEP AT : ${stoplossab[abcount]}`);
                  sell_stop = false;
                  buy_stop = true;
                  bepab[abcount] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  var hasil = 0;
                  //
                } else {
                  stop_lossab[abcount] = true;
                  simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_lossab[abcount] = true;
                simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_lossab[abcount] = true;
                simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
            }
            if (
              (open_value >= stoplossab[abcount] ||
                low_value >= stoplossab[abcount] ||
                high_value >= stoplossab[abcount]) &&
              sella
            ) {
              setup = "C1.a";
              sella = false;
              var entry = parseFloat(cupa).toFixed(2);
              var hasil = cupa - stoplossab[abcount];
              hasilpip = parseFloat(stoplossab[abcount] - cupa).toFixed(2);
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Stop";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value >= stoplossab[abcount] ||
                low_value >= stoplossab[abcount] ||
                high_value >= stoplossab[abcount]) &&
              sellb
            ) {
              setup = "C1.b";
              sellb = false;
              ab = false;
              hasilpip = parseFloat(stoplossab[abcount] - cupa).toFixed(2);
              var entry = parseFloat(cupa).toFixed(2);
              var hasil = cupa - stoplossab[abcount];
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Limit";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
          }
          if (c2d >= open_value && open_value >= c2c && !onlya) {
            if (!setopen) {
              sellstop = c2c;
              simulasi(`SELL STOP : ${sellstop}`);
              sell_stop = true;
              buystop = c2d;
              simulasi(`BUY STOP : ${buystop}`);
              buy_stop = true;
              setopen = true;
              if (checkab) {
                ab = true;
              }
            }
            if (setopen) {
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
                  stoploss[counter] = buystop;
                  bep[counter] = false;
                  var pipsell = parseFloat(buystop - sellstop).toFixed(2);
                  // if (!invers) {
                  //   ab = false;
                  // } else {
                  //   ab = true;
                  // }
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
                  stoploss[counter] = sellstop;
                  bep[counter] = false;
                  var pipbuy = parseFloat(buystop - sellstop).toFixed(2);
                  // if (!invers) {
                  //   ab = true;
                  // } else {
                  //   ab = false;
                  // }
                }
              }
            }
          }
          if (sell || sella | sellb) {
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
                stoploss[counter] = ts5;
                stoplossab[abcount] = ts5;
                tscount = 7;
              } else if (tp6s) {
                stoploss[counter] = ts4;
                stoplossab[abcount] = ts4;
                tscount = 6;
              } else if (tp5s) {
                stoploss[counter] = ts3;
                stoplossab[abcount] = ts3;
                tscount = 5;
              } else if (tp4s) {
                stoploss[counter] = ts2;
                stoplossab[abcount] = ts2;
                tscount = 4;
              } else if (tp3s) {
                stoploss[counter] = ts1;
                stoplossab[abcount] = ts1;
                tscount = 3;
              } else if (tp2s) {
                stoploss[counter] = ts;
                stoplossab[abcount] = ts;
                tscount = 2;
              } else if (tp1s) {
                stoploss[counter] = ts;
                stoplossab[abcount] = ts;
                tscount = 1;
              }
            } else if (
              (open_value <= bepsell ||
                low_value <= bepsell ||
                high_value <= bepsell) &&
              !tp1s &&
              !tp2s &&
              !tp3s &&
              !tp4s &&
              !tp5s &&
              !tp6s &&
              !tp7s &&
              (!bepab[abcount] || !bep[counter])
            ) {
              bep[counter] = true;
              bepab[abcount] = true;
              stoploss[counter] = sellstop;
              stoplossab[abcount] = sellstop;
            }
          } else if (buy || buya || buyb) {
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
                stoploss[counter] = c2tp5;
                stoplossab[abcount] = c2tp5;
                tscount = 7;
              } else if (tp6b) {
                stoploss[counter] = c2tp4;
                stoplossab[abcount] = c2tp4;
                tscount = 6;
              } else if (tp5b) {
                stoploss[counter] = c2tp3;
                stoplossab[abcount] = c2tp3;
                tscount = 5;
              } else if (tp4b) {
                stoploss[counter] = c2tp2;
                stoplossab[abcount] = c2tp2;
                tscount = 4;
              } else if (tp3b) {
                stoploss[counter] = c2tp1;
                stoplossab[abcount] = c2tp1;
                tscount = 3;
              } else if (tp2b) {
                stoploss[counter] = c2tp;
                stoplossab[abcount] = c2tp;
                tscount = 2;
              } else if (tp1b) {
                stoploss[counter] = c2tp;
                stoplossab[abcount] = c2tp;
                tscount = 1;
              }
            } else if (
              (open_value >= fibo23 ||
                low_value >= fibo23 ||
                high_value >= fibo23) &&
              !tp1b &&
              !tp2b &&
              !tp3b &&
              !tp4b &&
              !tp5b &&
              !tp6b &&
              !tp7b &&
              (!bepab[abcount] || !bep[counter])
            ) {
              bep[counter] = true;
              bepab[abcount] = true;
              stoploss[counter] = buystop;
              stoplossab[abcount] = buystop;
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
            if (buy) {
              setup = "C1.c";
              hasilpip = pipbuy;
              hasil = parseFloat(open_value - buystop).toFixed(2);
              lossvalue = sellstop;
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (buya) {
              setup = "C1.a";
              hasilpip = pipbuya;
              lossvalue = sellstop;
              hasil = parseFloat(open_value - cupa).toFixed(2);
              simulasi(`Sell A Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Buy Stop";
              } else if (cond2) {
                var order = "Buy Stop";
              } else if (cond3) {
                var order = "Buy Limit";
              }
              var entry = cupa;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (buyb) {
              hasilpip = pipbuyb;
              setup = "C1.b";
              lossvalue = stoploss;
              hasil = parseFloat(open_value - cupb).toFixed(2);
              simulasi(`Sell B Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Buy Stop";
              } else if (cond2) {
                var order = "Buy Limit";
              } else if (cond3) {
                var order = "Buy Limit";
              }
              var entry = cupb;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (sell) {
              setup = "C1.d";
              hasilpip = pipsell;
              hasil = parseFloat(entry - open_value).toFixed(2);
              lossvalue = buystop;
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (sella) {
              setup = "C1.a";
              lossvalue = buystop;
              hasilpip = pipsella;
              hasil = parseFloat(cupa - open_value).toFixed(2);
              simulasi(`Sell A Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Stop";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              hasilpip = pipsella;
              var entry = cupa;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (sellb) {
              hasilpip = pipsellb;
              setup = "C1.b";
              lossvalue = buystop;
              hasil = parseFloat(cupb - open_value).toFixed(2);
              simulasi(`Sell B Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Limit";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              var entry = cupb;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            break;
          }
        }
      } else {
        var trend = "DOWN";
        downtrend = true;
        if (fibo61 >= first_next && first_next >= fibo23) {
          // addParagraphToAnalisa(`OPEN A`);
          var letter = "A";
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
            lossvalue = stoploss;
            if (
              (open_value <= stoploss ||
                low_value <= stoploss ||
                high_value <= stoploss) &&
              buy
            ) {
              hasilpip = pipbuy;
              if (counter < 5) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = false;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(stoploss - buystop).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                //   if (bep) {
                //     var closesetup = "BEP";
                //     risk = 0;
                //   }
                //   simulasi(`STOP LOSS : ${stoploss}`);
                // }
                else if (
                  bep &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = false;
                  bep = false;
                  var closesetup = "BEP";
                  risk = 0;
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
                var closesetup = `TS.${tscount}`;
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
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
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
              hasilpip = pipsell;
              if (counter < 5) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   simulasi(`STOP LOSS : ${stoploss}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(sellstop - stoploss).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bep &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = true;
                  bep = false;
                  var closesetup = "BEP";
                  risk = 0;
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
                var closesetup = `TS.${tscount}`;
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
              tab = tab + 1;

              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
          }
          // SETUP A
          if (
            (((a1a >= open_value && open_value >= a1b) ||
              (a1a >= high_value && high_value >= a1b) ||
              (a1a >= low_value && low_value >= a1b)) &&
              onlya) ||
            !onlya
          ) {
            if (!setopen) {
              sellstop = parseFloat(a1b).toFixed(2);
              console.log(`SELL STOP : ${sellstop}`);
              simulasi(`SELL STOP : ${sellstop}`);
              sell_stop = true;
              buystop = parseFloat(a1a).toFixed(2);
              console.log(`BUY STOP : ${buystop}`);
              simulasi(`BUY STOP : ${buystop}`);
              buy_stop = true;
              setopen = true;
              if (checkab) {
                ab = true;
              }
            }
            if (setopen) {
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
                  setup = "A2";
                  sell = true;
                  buy = false;
                  counter = counter + 1;
                  buy_stop = true;
                  buystop = a1a;
                  stoploss = buystop;
                  sell_stop = false;
                  var pipsell = parseFloat(buystop - sellstop).toFixed(2);
                  if (!invers) {
                    ab = true;
                  } else {
                    ab = false;
                  }
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
                  setup = "A1";
                  buy = true;
                  sell = false;
                  counter = counter + 1;
                  buy_stop = false;
                  sellstop = a1b;
                  stoploss = sellstop;
                  sell_stop = true;
                  var pipbuy = parseFloat(buystop - sellstop).toFixed(2);
                  // if (!invers) {
                  //   ab = false;
                  // } else {
                  //   ab = true;
                  // }
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
                tscount = 7;
              } else if (tp6b) {
                stoploss = a1atp4;
                tscount = 6;
              } else if (tp5b) {
                stoploss = a1atp3;
                tscount = 5;
              } else if (tp4b) {
                stoploss = a1atp2;
                tscount = 4;
              } else if (tp3b) {
                stoploss = a1atp1;
                tscount = 3;
              } else if (tp2b) {
                stoploss = a1atp;
                tscount = 2;
              } else if (tp1b) {
                stoploss = a1atp;
                tscount = 1;
              }
            }
            if (bepa) {
              if (
                (open_value >= fibo78 ||
                  low_value >= fibo78 ||
                  high_value >= fibo78) &&
                !bep
              ) {
                bep = true;
                stoploss = buystop;
              }
            }
            if (!bepa) {
              if (
                (open_value >= fibo100 ||
                  low_value >= fibo100 ||
                  high_value >= fibo100) &&
                !bep
              ) {
                bep = true;
                stoploss = buystop;
              }
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
                stoploss = parseFloat(a1btp5).toFixed(2);
                tscount = 7;
              } else if (tp6s) {
                stoploss = parseFloat(a1btp4).toFixed(2);
                tscount = 6;
              } else if (tp5s) {
                stoploss = parseFloat(a1btp3).toFixed(2);
                tscount = 5;
              } else if (tp4s) {
                stoploss = parseFloat(a1btp2).toFixed(2);
                tscount = 4;
              } else if (tp3s) {
                stoploss = parseFloat(a1btp1).toFixed(2);
                tscount = 3;
              } else if (tp2s) {
                stoploss = parseFloat(a1btp).toFixed(2);
                tscount = 2;
              } else if (tp1s) {
                stoploss = parseFloat(a1btp).toFixed(2);
                tscount = 1;
              }
            }
            if (bepa) {
              if (
                (open_value <= fibo23 ||
                  low_value <= fibo23 ||
                  high_value <= fibo23) &&
                !bep
              ) {
                bep = true;
                stoploss = sellstop;
              }
            }
            if (!bepa) {
              if (
                (open_value <= fibo0 ||
                  low_value <= fibo0 ||
                  high_value <= fibo0) &&
                !bep
              ) {
                bep = true;
                stoploss = sellstop;
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
              hasilpip = pipbuy;
              lossvalue = sellstop;
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            } else if (sell) {
              hasil = parseFloat(entry - open_value).toFixed(2);
              hasilpip = pipsell;
              lossvalue = buystop;
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            break;
          }
        } else if (fibo23 >= first_next && first_next >= fibo0) {
          var letter = "B";
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
          if (invers) {
            bdowna = parseFloat(((fibo0 + fibo23) / 2 - keypip).toFixed(2));
            bdownb = parseFloat((fibo23 - keypip).toFixed(2));
            console.log(`bdowna = ${bdowna} bdownb = ${bdownb}`);
          } else {
            bdowna = parseFloat(
              ((fibo0 + fibo23) / 2 + keypip + sphread).toFixed(2)
            );
            bdownb = parseFloat((fibo0 + keypip + sphread).toFixed(2));
            console.log(`bdowna = ${bdowna} bdownb = ${bdownb}`);
          }
          if (invers) {
            if (first_next >= bdownb) {
              cond1 = true;
            } else if (first_next <= bdownb && first_next >= bdowna) {
              cond2 = true;
            } else if (first_next <= bdowna) {
              cond3 = true;
            }
          } else if (!invers) {
            if (first_next >= bdowna) {
              cond1 = true;
            } else if (first_next <= bdowna && first_next >= bdownb) {
              cond2 = true;
            } else if (first_next <= bdownb) {
              cond3 = true;
            }
          }
          if (!invers && ab) {
            if (!buya || !buyb) {
              if (cond1) {
                if (
                  (open_value <= bdownb ||
                    low_value <= bdownb ||
                    high_value <= bdownb) &&
                  !buyb
                ) {
                  abcount = abcount + 1;
                  buyb = true;
                  simulasi(`BUY 1B in ${minute}`);
                  console.log(`BUY 1B in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Buy Limit";
                  var entry2 = bdownb;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value <= bdowna ||
                    low_value <= bdowna ||
                    high_value <= bdowna) &&
                  !buya
                ) {
                  abcount = abcount + 1;
                  buya = true;
                  simulasi(`BUY 1A in ${minute}`);
                  console.log(`BUY 1A in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Buy Limit";
                  var entry3 = bdowna;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
              } else if (cond2) {
                if (
                  (open_value >= bdowna ||
                    low_value >= bdowna ||
                    high_value >= bdowna) &&
                  !buyb &&
                  !buya
                ) {
                  abcount = abcount + 1;
                  buya = true;
                  buyb = false;
                  simulasi(`BUY 2A in ${minute}`);
                  console.log(`BUY 2A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Stop";
                  var entry3 = bdowna;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value <= bdownb ||
                    low_value <= bdownb ||
                    high_value <= bdownb) &&
                  buya &&
                  !buyb
                ) {
                  abcount = abcount + 1;
                  buyb = true;
                  simulasi(`BUY 2B in ${minute}`);
                  console.log(`BUY 2B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Limit";
                  var entry2 = bdownb;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value <= bdownb ||
                    low_value <= bdownb ||
                    high_value <= bdownb) &&
                  !buya &&
                  !buyb
                ) {
                  abcount = abcount + 1;
                  buyb = true;
                  buya = false;
                  simulasi(`BUY 2B in ${minute}`);
                  console.log(`BUY 2B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Limit";
                  var entry3 = bdownb;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value >= bdowna ||
                    low_value >= bdowna ||
                    high_value >= bdowna) &&
                  buyb &&
                  !buya
                ) {
                  abcount = abcount + 1;
                  buya = true;
                  simulasi(`BUY 2A in ${minute}`);
                  console.log(`BUY 2A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Stop";
                  var entry2 = bdowna;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
              }
              if (cond3) {
                if (
                  (open_value >= bdownb ||
                    low_value >= bdownb ||
                    high_value >= bdownb) &&
                  !buyb
                ) {
                  abcount = abcount + 1;
                  buyb = true;
                  simulasi(`BUY 3B in ${minute}`);
                  console.log(`BUY 3B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Stop";
                  var entry3 = bdownb;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value >= bdowna ||
                    low_value >= bdowna ||
                    high_value >= bdowna) &&
                  !buya
                ) {
                  abcount = abcount + 1;
                  buya = true;
                  simulasi(`BUY 3A in ${minute}`);
                  console.log(`BUY 3A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Buy Stop";
                  var entry2 = bdowna;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
              }
            }
            pipbuya = parseFloat(bdowna - sellstop).toFixed(2);
            pipbuyb = parseFloat(bdownb - sellstop).toFixed(2);
          }
          if (invers && ab) {
            if (!sella || !sellb) {
              if (cond1) {
                if (
                  (open_value <= bdownb ||
                    low_value <= bdownb ||
                    high_value <= bdownb) &&
                  !sellb
                ) {
                  abcount = abcount + 1;
                  sellb = true;
                  simulasi(`SELL 1B in ${minute}`);
                  console.log(`SELL B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Stop";
                  var entry2 = bdownb;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value <= bdowna ||
                    low_value <= bdowna ||
                    high_value <= bdowna) &&
                  !sella
                ) {
                  abcount = abcount + 1;
                  sella = true;
                  simulasi(`SELL 1A in ${minute}`);
                  console.log(`SELL A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Stop";
                  var entry3 = bdowna;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
              } else if (cond2) {
                if (
                  (open_value >= bdownb ||
                    low_value >= bdownb ||
                    high_value >= bdownb) &&
                  !sellb &&
                  !sella
                ) {
                  abcount = abcount + 1;
                  sellb = true;
                  simulasi(`SELL 2B in ${minute}`);
                  console.log(`SELL B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Limit";
                  var entry2 = bdownb;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value <= bdowna ||
                    low_value <= bdowna ||
                    high_value <= bdowna) &&
                  sellb &&
                  !sella
                ) {
                  abcount = abcount + 1;
                  sella = true;
                  simulasi(`SELL 2A in ${minute}`);
                  console.log(`SELL A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Stop";
                  var entry3 = bdowna;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value <= bdowna ||
                    low_value <= bdowna ||
                    high_value <= bdowna) &&
                  !sella &&
                  !sellb
                ) {
                  abcount = abcount + 1;
                  sella = true;
                  simulasi(`SELL 2A in ${minute}`);
                  console.log(`SELL A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Stop";
                  var entry3 = bdowna;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value >= bdownb ||
                    low_value >= bdownb ||
                    high_value >= bdownb) &&
                  sella &&
                  !sellb
                ) {
                  abcount = abcount + 1;
                  sellb = true;
                  simulasi(`SELL 2B in ${minute}`);
                  console.log(`SELL B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Limit";
                  var entry2 = bdownb;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
              }
              if (cond3) {
                if (
                  (open_value >= bdowna ||
                    low_value >= bdowna ||
                    high_value >= bdowna) &&
                  !sella
                ) {
                  abcount = abcount + 1;
                  sella = true;
                  simulasi(`SELL 3A in ${minute}`);
                  console.log(`SELL A in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Limit";
                  var entry3 = bdowna;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value >= bdownb ||
                    low_value >= bdownb ||
                    high_value >= bdownb) &&
                  !sellb
                ) {
                  abcount = abcount + 1;
                  sellb = true;
                  simulasi(`SELL 3B in ${minute}`);
                  console.log(`SELL B in ${minute}`);
                  stop_lossab[abcount] = false;
                  var order = "Sell Limit";
                  var entry2 = bdownb;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
              }
            }
            pipsella = parseFloat(buystop - bdowna).toFixed(2);
            pipsellb = parseFloat(buystop - bdownb).toFixed(2);
          }

          if (!stop_loss) {
            if (
              (open_value <= stoploss[counter] ||
                low_value <= stoploss[counter] ||
                high_value <= stoploss[counter]) &&
              buy
            ) {
              lossvalue = parseFloat(sellstop).toFixed(2);
              hasilpip = pipbuy;
              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = false;
                  hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   simulasi(`STOP LOSS : ${stoploss[counter]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bep[counter] &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = false;
                  bep[counter] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  hasil = 0;
                  //
                  var hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss[counter]}`);
                hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss[counter]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);

              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
            }
            if (
              (open_value <= stoploss[counter] ||
                low_value <= stoploss[counter] ||
                high_value <= stoploss[counter]) &&
              buy
            ) {
              setup = "B2.c";
              buy = false;
              hasilpip = pipbuy;
              equity = parseFloat(equity * (risk / 100) + equity);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value >= stoploss[counter] ||
                low_value >= stoploss[counter] ||
                high_value >= stoploss[counter]) &&
              sell
            ) {
              lossvalue = parseFloat(buystop).toFixed(2);
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                  sell_stop = false;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss[counter]);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   simulasi(`STOP LOSS : ${stoploss[counter]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bep[counter] &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss[counter]}`);
                  sell_stop = false;
                  buy_stop = true;
                  bep[counter] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  var hasil = 0;
                  // var //
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss[counter]}`);
                hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }

              var closeprice = parseFloat(stoploss[counter]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
            }
            if (
              (open_value >= stoploss[counter] ||
                low_value >= stoploss[counter] ||
                high_value >= stoploss[counter]) &&
              sell
            ) {
              hasilpip = pipsell;
              sell = false;
              var setup = "B2.d";
              var order = "Sell Stop";
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              equity = parseFloat(equity * (risk / 100) + equity);
              tab = tab + 1;
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
          }
          if (!stop_lossab[abcount]) {
            if (
              (open_value <= stoplossab[abcount] ||
                low_value <= stoplossab[abcount] ||
                high_value <= stoplossab[abcount]) &&
              (buya || buyb)
            ) {
              lossvalue = parseFloat(sellstop).toFixed(2);
              hasilpip = pipbuy;
              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = false;
                  hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bepab[abcount] &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = false;
                  bepab[abcount] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  hasil = 0;
                  //
                  var hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);

              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
            }
            if (
              (open_value <= stoplossab[abcount] ||
                low_value <= stoplossab[abcount] ||
                high_value <= stoplossab[abcount]) &&
              buya
            ) {
              hasilpip = pipbuya;
              var setup = "B2.a";
              var entry = bdowna;
              var buya = false;
              var ab = false;
              var hasil = stoplossab[abcount] - bdowna;
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Buy Limit";
              } else if (cond2) {
                var order = "Buy Stop";
              } else if (cond3) {
                var order = "Buy Stop";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value <= stoplossab[abcount] ||
                low_value <= stoplossab[abcount] ||
                high_value <= stoplossab[abcount]) &&
              buyb
            ) {
              var setup = "B2.b";
              hasilpip = pipbuyb;
              var entry = bdownb;
              var buyb = false;
              var ab = false;
              var hasil = stoplossab[abcount] - bdownb;
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Buy Limit";
              } else if (cond2) {
                var order = "Buy Limit";
              } else if (cond3) {
                var order = "Buy Stop";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value >= stoplossab[abcount] ||
                low_value >= stoplossab[abcount] ||
                high_value >= stoplossab[abcount]) &&
              (sella || sellb)
            ) {
              lossvalue = parseFloat(buystop).toFixed(2);
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                  sell_stop = false;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoplossab[abcount]);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bepab[abcount] &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoplossab[abcount]}`);
                  sell_stop = false;
                  buy_stop = true;
                  bepab[abcount] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  var hasil = 0;
                  // var //
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }

              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
            }
            if (
              (open_value >= stoplossab[abcount] ||
                low_value >= stoplossab[abcount] ||
                high_value >= stoplossab[abcount]) &&
              sella
            ) {
              hasilpip = pipsella;
              setup = "B2.a";
              sella = false;
              ab = false;
              entry = bdowna;
              var entry = bdowna;
              var hasil = bdowna - stoplossab[abcount];
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Stop";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value >= stoplossab[abcount] ||
                low_value >= stoplossab[abcount] ||
                high_value >= stoplossab[abcount]) &&
              sellb
            ) {
              hasilpip = pipsellb;
              entry = bdownb;
              setup = "B2.b";
              sellb = false;
              ab = false;
              var entry = bdownb;
              var hasil = bdownb - stoplossab[abcount];
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Limit";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
          }
          if (b1d >= open_value && open_value >= b1c && !onlya) {
            if (!setopen) {
              sellstop = b1c;
              simulasi(`SELL STOP : ${sellstop}`);
              sell_stop = true;
              buystop = b1d;
              simulasi(`BUY STOP : ${buystop}`);
              buy_stop = true;
              setopen = true;
              if (checkab) {
                ab = true;
              }
            }
          }
          if (setopen) {
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
                stoploss[counter] = buystop;
                bep[counter] = false;
                var pipsell = parseFloat(buystop - sellstop).toFixed(2);
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
                (!buy_stop || !sell)
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
                stoploss[counter] = sellstop;
                bep[counter] = false;
                var pipbuy = parseFloat(buystop - sellstop).toFixed(2);
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
                stoploss[counter] = ts5;
                stoplossab[abcount] = ts5;
                tscount = 7;
              } else if (tp6s) {
                stoploss[counter] = ts4;
                stoplossab[abcount] = ts4;
                tscount = 6;
              } else if (tp5s) {
                stoploss[counter] = ts3;
                stoplossab[abcount] = ts3;
                tscount = 5;
              } else if (tp4s) {
                stoploss[counter] = ts2;
                stoplossab[abcount] = ts2;
                tscount = 4;
              } else if (tp3s) {
                stoploss[counter] = ts1;
                stoplossab[abcount] = ts1;
                tscount = 3;
              } else if (tp2s) {
                stoploss[counter] = ts;
                stoplossab[abcount] = ts;
                tscount = 2;
              } else if (tp1s) {
                stoploss[counter] = ts;
                stoplossab[abcount] = ts;
                tscount = 1;
              }
            } else if (
              (open_value <= bepsell ||
                low_value <= bepsell ||
                high_value <= bepsell) &&
              !tp1s &&
              !tp2s &&
              !tp3s &&
              !tp4s &&
              !tp5s &&
              !tp6s &&
              !tp7s &&
              (!bepab[abcount] || !bep[counter])
            ) {
              bep[counter] = true;
              bepab[abcount] = true;
              stoploss[counter] = sellstop;
              stoplossab[abcount] = sellstop;
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
                stoploss[counter] = b1tp5;
                stoplossab[abcount] = b1tp5;
                tscount = 7;
              } else if (tp6b) {
                stoploss[counter] = b1tp4;
                stoplossab[abcount] = b1tp4;
                tscount = 6;
              } else if (tp5b) {
                stoploss[counter] = b1tp3;
                stoplossab[abcount] = b1tp3;
                tscount = 5;
              } else if (tp4b) {
                stoploss[counter] = b1tp2;
                stoplossab[abcount] = b1tp2;
                tscount = 4;
              } else if (tp3b) {
                stoploss[counter] = b1tp1;
                stoplossab[abcount] = b1tp1;
                tscount = 3;
              } else if (tp2b) {
                stoploss[counter] = b1tp;
                stoplossab[abcount] = b1tp;
                tscount = 2;
              } else if (tp1b) {
                stoploss[counter] = b1tp;
                stoplossab[abcount] = b1tp;
                tscount = 1;
              }
            } else if (
              (open_value >= fibo61 ||
                low_value >= fibo61 ||
                high_value >= fibo61) &&
              !tp1b &&
              !tp2b &&
              !tp3b &&
              !tp4b &&
              !tp5b &&
              !tp6b &&
              !tp7b &&
              (!bepab[abcount] || !bep[counter])
            ) {
              bep[counter] = true;
              bepab[abcount] = true;
              stoploss[counter] = buystop;
              stoplossab[abcount] = buystop;
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
            if (buy) {
              hasilpip = pipbuy;
              lossvalue = sellstop;
              setup = "B2.c";
              hasil = parseFloat(open_value - buystop).toFixed(2);
              var order = "Buy Stop";
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            //terahir
            if (buya) {
              setup = "B2.a";
              lossvalue = sellstop;
              hasilpip = pipbuya;
              hasil = parseFloat(open_value - bdowna).toFixed(2);
              simulasi(`Buy A Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Buy Stop";
              } else if (cond2) {
                var order = "Buy Stop";
              } else if (cond3) {
                var order = "Buy Limit";
              }
              var entry = bdowna;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (buyb) {
              lossvalue = sellstop;
              setup = "B2.b";
              hasilpip = pipbuyb;
              hasil = parseFloat(open_value - bdownb).toFixed(2);
              simulasi(`Buy B Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Buy Stop";
              } else if (cond2) {
                var order = "Buy Stop";
              } else if (cond3) {
                var order = "Buy Limit";
              }
              var entry = bdownb;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (sell) {
              setup = "B2.d";
              lossvalue = buystop;
              hasilpip = pipsell;
              hasil = parseFloat(sellstop - open_value).toFixed(2);
              var order = "Sell Stop";
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (sella) {
              setup = "B2.a";
              lossvalue = buystop;
              hasilpip = pipsella;
              hasil = parseFloat(bdowna - open_value).toFixed(2);
              simulasi(`Sell A Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Stop";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              var entry = bdowna;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (sellb) {
              setup = "B2.b";
              lossvalue = buystop;
              hasilpip = pipsellb;
              hasil = parseFloat(bdownb - open_value).toFixed(2);
              simulasi(`Sell B Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Limit";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              var entry = bdownb;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }

            break;
          }
        } else if (fibo100 >= first_next && first_next >= fibo61) {
          // addParagraphToAnalisa(`OPEN C`);
          // console.log("OPEN C");
          var letter = "C";
          selisihbep = fibo0 - fibo23;
          c1a = (fibo61 + fibo100) / 2 + keypip + sphread;
          c1b = fibo61 + keypip + sphread;
          c1c = parseFloat(fibo100 + keypip + sphread).toFixed(2);
          c1d = parseFloat(fibo61 - keypip).toFixed(2);
          c1tp = fibo0 + keypip + sphread;
          c1tp1 = c1tp - trail;
          c1tp2 = c1tp1 - trail;
          c1tp3 = c1tp2 - trail;
          c1tp4 = c1tp3 - trail;
          c1tp5 = c1tp4 - trail;
          c1tp6 = c1tp5 - trail;
          selisihts = c1d - fibo0;
          tsbuy = c1c + selisihts;
          ts = tsbuy - keypip;
          ts1 = ts + 4;
          ts2 = ts1 + 4;
          ts3 = ts2 + 4;
          ts4 = ts3 + 4;
          ts5 = ts4 + 4;
          ts6 = ts5 + 4;
          bepbuy = tsbuy - selisihbep;
          if (invers) {
            cdowna = parseFloat(
              ((fibo61 + fibo100) / 2 + keypip + sphread).toFixed(2)
            );
            cdownb = parseFloat((fibo61 + keypip + sphread).toFixed(2));
          } else {
            cdowna = parseFloat(((fibo61 + fibo100) / 2 - keypip).toFixed(2));
            cdownb = parseFloat((fibo100 - keypip).toFixed(2));
            console.log(`cdowna = ${cdowna} cdownb = ${cdownb}`);
          }
          if (invers) {
            if (first_next >= cdowna) {
              cond1 = true;
            } else if (first_next <= cdowna && first_next >= cdownb) {
              cond2 = true;
            } else if (first_next <= cdownb) {
              cond3 = true;
            }
          } else if (!invers) {
            if (first_next >= cdownb) {
              cond1 = true;
            } else if (first_next <= cdownb && first_next >= cdowna) {
              cond2 = true;
            } else if (first_next <= cdowna) {
              cond3 = true;
            }
          }
          if (!invers && ab) {
            if (!sella || !sellb) {
              if (cond1) {
                if (
                  (open_value <= cdownb ||
                    low_value <= cdownb ||
                    high_value <= cdownb) &&
                  !sellb
                ) {
                  abcount = abcount + 1;
                  sellb = true;
                  simulasi(`SELL 1B in ${minute}`);
                  console.log(`SELL B in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Sell Stop";
                  var entry2 = cdownb;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value <= cdowna ||
                    low_value <= cdowna ||
                    high_value <= cdowna) &&
                  !sella
                ) {
                  abcount = abcount + 1;
                  sella = true;
                  simulasi(`SELL 1A in ${minute}`);
                  console.log(`SELL A in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Sell Stop";
                  var entry3 = cdowna;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
              } else if (cond2) {
                if (
                  (open_value >= cdownb ||
                    low_value >= cdownb ||
                    high_value >= cdownb) &&
                  !sellb &&
                  !sella
                ) {
                  abcount = abcount + 1;
                  sellb = true;
                  simulasi(`SELL 2B in ${minute}`);
                  console.log(`SELL B in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Sell Limit";
                  var entry2 = cdownb;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value <= cdowna ||
                    low_value <= cdowna ||
                    high_value <= cdowna) &&
                  sellb &&
                  !sella
                ) {
                  abcount = abcount + 1;
                  sella = true;
                  simulasi(`SELL 2A in ${minute}`);
                  console.log(`SELL A in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Sell Stop";
                  var entry3 = cdowna;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value <= cdowna ||
                    low_value <= cdowna ||
                    high_value <= cdowna) &&
                  !sella &&
                  !sellb
                ) {
                  abcount = abcount + 1;
                  sella = true;
                  simulasi(`SELL 2A in ${minute}`);
                  console.log(`SELL A in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Sell Stop";
                  var entry3 = cdowna;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value >= cdownb ||
                    low_value >= cdownb ||
                    high_value >= cdownb) &&
                  sella &&
                  !sellb
                ) {
                  abcount = abcount + 1;
                  sellb = true;
                  simulasi(`SELL 2B in ${minute}`);
                  console.log(`SELL B in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Sell Limit";
                  var entry2 = cdownb;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
              }
              if (cond3) {
                if (
                  (open_value >= cdowna ||
                    low_value >= cdowna ||
                    high_value >= cdowna) &&
                  !sella
                ) {
                  abcount = abcount + 1;
                  sella = true;
                  simulasi(`SELL 3A in ${minute}`);
                  console.log(`SELL A in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Sell Limit";
                  var entry3 = cdowna;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
                if (
                  (open_value >= cdownb ||
                    low_value >= cdownb ||
                    high_value >= cdownb) &&
                  !sellb
                ) {
                  abcount = abcount + 1;
                  sellb = true;
                  simulasi(`SELL 3B in ${minute}`);
                  console.log(`SELL B in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Sell Limit";
                  var entry2 = cdownb;
                  stoplossab[abcount] = buystop;
                  bepab[abcount] = false;
                }
              }
            }
            var pipsella = parseFloat(buystop - cdowna).toFixed(2);
            var pipsellb = parseFloat(buystop - cdownb).toFixed(2);
          }

          if (invers && ab) {
            if (!buya || !buyb) {
              if (cond1) {
                if (
                  (open_value <= cdownb ||
                    low_value <= cdownb ||
                    high_value <= cdownb) &&
                  !buyb
                ) {
                  abcount = abcount + 1;
                  buyb = true;
                  simulasi(`BUY 1B in ${minute}`);
                  console.log(`BUY 1B in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Buy Limit";
                  var entry2 = cdownb;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value <= cdowna ||
                    low_value <= cdowna ||
                    high_value <= cdowna) &&
                  !buya
                ) {
                  abcount = abcount + 1;
                  buya = true;
                  simulasi(`BUY 1A in ${minute}`);
                  console.log(`BUY 1A in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Buy Limit";
                  var entry3 = bupa;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
              } else if (cond2) {
                if (
                  (open_value >= cdowna ||
                    low_value >= cdowna ||
                    high_value >= cdowna) &&
                  !buyb &&
                  !buya
                ) {
                  abcount = abcount + 1;
                  buya = true;
                  simulasi(`BUY 2A in ${minute}`);
                  console.log(`BUY 2A in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Buy Stop";
                  var entry3 = cdowna;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value <= cdownb ||
                    low_value <= cdownb ||
                    high_value <= cdownb) &&
                  buya &&
                  !buyb
                ) {
                  abcount = abcount + 1;
                  buyb = true;
                  simulasi(`BUY 2B in ${minute}`);
                  console.log(`BUY 2B in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Buy Limit";
                  var entry2 = cdownb;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value <= cdownb ||
                    low_value <= cdownb ||
                    high_value <= cdownb) &&
                  !buya &&
                  !buyb
                ) {
                  abcount = abcount + 1;
                  buyb = true;
                  simulasi(`BUY 2B in ${minute}`);
                  console.log(`BUY 2B in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Buy Limit";
                  var entry3 = cdownb;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value >= cdowna ||
                    low_value >= cdowna ||
                    high_value >= cdowna) &&
                  buyb &&
                  !buya
                ) {
                  abcount = abcount + 1;
                  buya = true;
                  simulasi(`BUY 2A in ${minute}`);
                  console.log(`BUY 2A in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Buy Stop";
                  var entry2 = cdowna;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
              }
              if (cond3) {
                if (
                  (open_value >= cdownb ||
                    low_value >= cdownb ||
                    high_value >= cdownb) &&
                  !buyb
                ) {
                  abcount = abcount + 1;
                  buyb = true;
                  simulasi(`BUY 3A in ${minute}`);
                  console.log(`BUY 3A in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Buy Stop";
                  var entry3 = cdownb;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
                if (
                  (open_value >= cdowna ||
                    low_value >= cdowna ||
                    high_value >= cdowna) &&
                  !buya
                ) {
                  abcount = abcount + 1;
                  buya = true;
                  simulasi(`BUY 3B in ${minute}`);
                  console.log(`BUY 3B in ${minute}`);
                  stop_lossab[abcount] = false;
                  // var order = "Buy Stop";
                  var entry2 = cdowna;
                  stoplossab[abcount] = sellstop;
                  bepab[abcount] = false;
                  // var hasilpip = parseFloat(stoplossab[abcount] - entry2).toFixed(2);
                }
              }
            }
            var pipbuya = parseFloat(cdowna - sellstop).toFixed(2);
            var pipbuyb = parseFloat(cdownb - sellstop).toFixed(2);
          }

          if (!stop_loss) {
            if (
              (open_value <= stoploss[counter] ||
                low_value <= stoploss[counter] ||
                high_value <= stoploss[counter]) &&
              buy
            ) {
              lossvalue = parseFloat(sellstop).toFixed(2);
              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = false;
                  hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   simulasi(`STOP LOSS : ${stoploss[counter]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bep[counter] &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = false;
                  bep[counter] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  hasil = 0;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss[counter]}`);
                hasil = parseFloat(stoploss[counter] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss[counter]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);

              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
            }
            if (
              (open_value <= stoploss[counter] ||
                low_value <= stoploss[counter] ||
                high_value <= stoploss[counter]) &&
              buy
            ) {
              setup = "C2.c";
              hasilpip = pipbuy;
              order = "Buy Stop";
              buy = false;
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value >= stoploss[counter] ||
                low_value >= stoploss[counter] ||
                high_value >= stoploss[counter]) &&
              sell
            ) {
              lossvalue = parseFloat(buystop).toFixed(2);
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                  sell_stop = false;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss[counter]);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                  //
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_loss = true;
                //   simulasi(`STOP LOSS : ${stoploss[counter]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bep[counter] &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss[counter]}`);
                  sell_stop = false;
                  buy_stop = true;
                  bep[counter] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  var hasil = 0;
                  closepip = 0;
                  //
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss[counter]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss[counter]}`);
                hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss[counter]}`);
                hasil = parseFloat(sellstop - stoploss[counter]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoploss[counter]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              // if (hasilpip !== 0) {
              //   risk = parseFloat(closepip / hasilpip).toFixed(2);
              // } else if (closepip !== 0) {
              //   risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              // } else {
              //   risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              // }
            }
            if (
              (open_value >= stoploss[counter] ||
                low_value >= stoploss[counter] ||
                high_value >= stoploss[counter]) &&
              sell
            ) {
              tab = tab + 1;
              sell = false;
              var setup = "C2.d";
              hasilpip = pipsell;
              var order = "Sell Stop";
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
          }
          if (!stop_lossab[abcount]) {
            if (
              (open_value <= stoplossab[abcount] ||
                low_value <= stoplossab[abcount] ||
                high_value <= stoplossab[abcount]) &&
              (buya || buyb)
            ) {
              lossvalue = parseFloat(sellstop).toFixed(2);
              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_lossab[abcount] = true;
                  simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = false;
                  hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_lossab[abcount] = true;
                //   simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bepab[abcount] &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_lossab[abcount] = true;
                  simulasi(`BEP AT : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = false;
                  bepab[abcount] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  hasil = 0;
                } else {
                  stop_lossab[abcount] = true;
                  simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_lossab[abcount] = true;
                simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_lossab[abcount] = true;
                simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                hasil = parseFloat(stoplossab[abcount] - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);

              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
            }
            if (
              (open_value <= stoplossab[abcount] ||
                low_value <= stoplossab[abcount] ||
                high_value <= stoplossab[abcount]) &&
              buya
            ) {
              var setup = "C2.a";
              var entry = cdowna;
              hasilpip = pipbuya;
              var buya = false;
              var ab = false;
              var hasil = stoplossab[abcount] - cdowna;
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Buy Limit";
              } else if (cond2) {
                var order = "Buy Stop";
              } else if (cond3) {
                var order = "Buy Stop";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value <= stoplossab[abcount] ||
                low_value <= stoplossab[abcount] ||
                high_value <= stoplossab[abcount]) &&
              buyb
            ) {
              var setup = "C2.b";
              var entry = cdownb;
              var hasilpip = pipbuyb;
              var hasil = stoplossab[abcount] - cdownb;
              var buyb = false;
              var ab = false;
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Buy Limit";
              } else if (cond2) {
                var order = "Buy Limit";
              } else if (cond3) {
                var order = "Buy Stop";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);

              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value >= stoplossab[abcount] ||
                low_value >= stoplossab[abcount] ||
                high_value >= stoplossab[abcount]) &&
              (sella || sellb)
            ) {
              lossvalue = parseFloat(buystop).toFixed(2);
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_lossab[abcount] = true;
                  simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                  sell_stop = false;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoplossab[abcount]);
                  simulasi(hasil);
                  var closesetup = `TS.${tscount}`;
                  //
                }
                // else if (minute.getHours() >= enambelas.getHours()) {
                //   stop_lossab[abcount] = true;
                //   simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                //   buy_stop = true;
                //   sell_stop = true;
                //   hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                //   simulasi(hasil);
                //   simulasi(counter);
                //   var closesetup = "Stop Loss";
                // }
                else if (
                  bepab[abcount] &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_lossab[abcount] = true;
                  simulasi(`BEP AT : ${stoplossab[abcount]}`);
                  sell_stop = false;
                  buy_stop = true;
                  bepab[abcount] = false;
                  var closesetup = "BEP";
                  risk = 0;
                  var hasil = 0;
                  closepip = 0;
                  //
                } else {
                  stop_lossab[abcount] = true;
                  simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                  simulasi(hasil);
                  var closesetup = "Stop Loss";
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_lossab[abcount] = true;
                simulasi(`TRAIL STOP : ${stoplossab[abcount]}`);
                hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = `TS.${tscount}`;
              } else {
                stop_lossab[abcount] = true;
                simulasi(`STOP LOSS : ${stoplossab[abcount]}`);
                hasil = parseFloat(sellstop - stoplossab[abcount]).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                var closesetup = "Stop Loss";
              }
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              // if (hasilpip !== 0) {
              //   risk = parseFloat(closepip / hasilpip).toFixed(2);
              // } else if (closepip !== 0) {
              //   risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              // } else {
              //   risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              // }
            }
            if (
              (open_value >= stoplossab[abcount] ||
                low_value >= stoplossab[abcount] ||
                high_value >= stoplossab[abcount]) &&
              sella
            ) {
              setup = "C2.a";
              sella = false;
              ab = false;
              var entry = parseFloat(cdowna).toFixed(2);
              var hasil = cdowna - stoplossab[abcount];
              hasilpip = pipsella;
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Stop";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
            if (
              (open_value >= stoplossab[abcount] ||
                low_value >= stoplossab[abcount] ||
                high_value >= stoplossab[abcount]) &&
              sellb
            ) {
              setup = "C2.b";
              sellb = false;
              ab = false;
              hasilpip = pipsellb;
              var entry = parseFloat(cdownb).toFixed(2);
              var hasil = cdownb - stoplossab[abcount];
              var closeprice = parseFloat(stoplossab[abcount]).toFixed(2);
              var closepip = parseFloat(hasil).toFixed(2);
              if (hasilpip !== 0) {
                risk = parseFloat(closepip / hasilpip).toFixed(2);
              } else if (closepip !== 0) {
                risk = Infinity; // or any other default value you prefer when hasilpip is 0 but closepip is not 0
              } else {
                risk = 0; // or any other default value you prefer when both closepip and hasilpip are 0
              }
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Limit";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              tab = tab + 1;
              equity = parseFloat(equity * (risk / 100) + equity);
              updateTable(
                tab,
                day,
                formattedDate,
                time,
                highestHigh,
                lowestLow,
                range,
                vlm,
                letter,
                trend,
                setup,
                order,
                entry,
                lossvalue,
                hasilpip,
                closesetup,
                closeprice,
                closepip,
                risk,

                equity
              );
            }
          }
          if (c1d <= open_value && open_value <= c1c && !onlya) {
            if (!setopen) {
              sellstop = parseFloat(c1d).toFixed(2);
              simulasi(`SELL STOP : ${sellstop}`);
              sell_stop = true;
              buystop = parseFloat(c1c).toFixed(2);
              simulasi(`BUY STOP : ${buystop}`);
              buy_stop = true;
              setopen = true;
              if (checkab) {
                ab = true;
              }
              // updateplot(c1d, c1c, cdowna, cdownb);
            }
          }

          if (setopen) {
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
                var entry = parseFloat(sellstop).toFixed(2);
                simulasi(`SELL STOP AT : ${sellstop}`);
                sell = true;
                buy = false;
                counter = counter + 1;
                buy_stop = true;
                sell_stop = false;
                stoploss[counter] = buystop;
                bep[counter] = false;
                var pipsell = parseFloat(buystop - sellstop).toFixed(2);
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
                stoploss[counter] = sellstop;
                bep[counter] = false;
                //
                var pipbuy = parseFloat(buystop - sellstop).toFixed(2);
              }
            }
          }

          if (sell || sella || sellb) {
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
                stoploss[counter] = c1tp5;
                stoplossab[abcount] = c1tp5;
                tscount = 7;
              } else if (tp6s) {
                stoploss[counter] = c1tp4;
                stoplossab[abcount] = c1tp4;
                tscount = 6;
              } else if (tp5s) {
                stoploss[counter] = c1tp3;
                stoplossab[abcount] = c1tp3;
                tscount = 5;
              } else if (tp4s) {
                stoploss[counter] = c1tp2;
                stoplossab[abcount] = c1tp2;
                tscount = 4;
              } else if (tp3s) {
                stoploss[counter] = c1tp1;
                stoplossab[abcount] = c1tp1;
                tscount = 3;
              } else if (tp2s) {
                stoploss[counter] = c1tp;
                stoplossab[abcount] = c1tp;
                tscount = 2;
              } else if (tp1s) {
                stoploss[counter] = c1tp;
                stoplossab[abcount] = c1tp;
                tscount = 1;
              }
            } else if (
              (open_value <= fibo23 ||
                low_value <= fibo23 ||
                high_value <= fibo23) &&
              !tp1s &&
              !tp2s &&
              !tp3s &&
              !tp4s &&
              !tp5s &&
              !tp6s &&
              !tp7s &&
              (!bep[counter] || !bepab[abcount])
            ) {
              bep[counter] = true;
              bepab[abcount] = true;
              stoploss[counter] = sellstop;
              stoplossab[abcount] = sellstop;
            }
          } else if (buy || buya || buyb) {
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
                stoploss[counter] = ts5;
                stoplossab[abcount] = ts5;
                tscount = 7;
              } else if (tp6b) {
                stoploss[counter] = ts4;
                stoplossab[abcount] = ts4;
                tscount = 6;
              } else if (tp5b) {
                stoploss[counter] = ts3;
                stoplossab[abcount] = ts3;
                tscount = 5;
              } else if (tp4b) {
                stoploss[counter] = ts2;
                stoplossab[abcount] = ts2;
                tscount = 4;
              } else if (tp3b) {
                stoploss[counter] = ts1;
                stoplossab[abcount] = ts1;
                tscount = 3;
              } else if (tp2b) {
                stoploss[counter] = ts;
                stoplossab[abcount] = ts;
                tscount = 2;
              } else if (tp1b) {
                stoploss[counter] = ts;
                stoplossab[abcount] = ts;
                tscount = 1;
              }
            } else if (
              (open_value >= bepbuy ||
                low_value >= bepbuy ||
                high_value >= bepbuy) &&
              !tp1b &&
              !tp2b &&
              !tp3b &&
              !tp4b &&
              !tp5b &&
              !tp6b &&
              !tp7b &&
              (!bepab[abcount] || !bep[counter])
            ) {
              bep[counter] = true;
              bepab[abcount] = true;
              stoploss[counter] = buystop;
              stoplossab[abcount] = buystop;
            }
            // simulasi(`${ts} ${ts1} ${ts2} ${ts3} ${ts4} ${ts5}`);
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
            if (buy) {
              setup = "C2.c";
              hasilpip = pipbuy;
              hasil = parseFloat(open_value - buystop).toFixed(2);
              stoploss = sellstop;
              lossvalue = sellstop;
              entry = buystop;
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (buya) {
              setup = "C2.a";
              lossvalue = sellstop;
              hasil = parseFloat(open_value - cdowna).toFixed(2);
              simulasi(`Sell A Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Buy Stop";
              } else if (cond2) {
                var order = "Buy Stop";
              } else if (cond3) {
                var order = "Buy Limit";
              }
              hasilpip = pipbuya;
              var entry = cdowna;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (buyb) {
              hasilpip = pipbuyb;
              setup = "C2.b";
              lossvalue = sellstop;
              hasil = parseFloat(open_value - cdownb).toFixed(2);
              simulasi(`Sell B Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Buy Stop";
              } else if (cond2) {
                var order = "Buy Limit";
              } else if (cond3) {
                var order = "Buy Limit";
              }
              var entry = cdownb;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (sell) {
              setup = "C2.d";
              hasilpip = pipsell;
              hasil = parseFloat(sellstop - open_value).toFixed(2);
              stoploss = buystop;
              lossvalue = buystop;
              entry = sellstop;
              simulasi(`Close Jam 11 ${hasil}`);
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (sella) {
              setup = "C2.a";
              hasilpip = pipsella;
              lossvalue = buystop;
              hasil = parseFloat(cdowna - open_value).toFixed(2);
              simulasi(`Sell A Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Stop";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              var entry = cdowna;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
            if (sellb) {
              hasilpip = pipsellb;
              setup = "C2.b";
              lossvalue = buystop;
              hasil = parseFloat(cdownb - open_value).toFixed(2);
              simulasi(`Sell B Close Jam 11 ${hasil}`);
              if (cond1) {
                var order = "Sell Stop";
              } else if (cond2) {
                var order = "Sell Limit";
              } else if (cond3) {
                var order = "Sell Limit";
              }
              var entry = cdownb;
              var closeprice = open_value;
              var closesetup = "Jam 11";
              var closepip = parseFloat(hasil).toFixed(2);
              tab = tab + 1;
              jam11();
            }
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
function totalvolume(data) {
  var totalVolume = 0;
  data.forEach(function (d) {
    var volume = parseFloat(d.Volume);
    totalVolume += volume;
  });
  return totalVolume;
}

// validateAndPlot();

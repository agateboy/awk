function validateAndPlot() {
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

  // VMATIKAN COMMAND UNTUK INPUT LEWAT WEBAPP
  var inputStartDate = new Date(document.getElementById("start-date").value);
  // var inputStartDate = "11-10-2021";

  // VMATIKAN COMMAND UNTUK INPUT LEWAT WEBAPP
  if (isNaN(inputStartDate)) {
    alert("Market Libur.");
    return;
  }

  // Hitung start dan end date untuk hari ini
  var startToday = new Date(inputStartDate);
  startToday.setHours(1, 0, 0, 0); // Set jam 01:00:00
  var endToday = new Date(startToday);
  endToday.setHours(23, 59, 59, 999); // Set jam 01:00:00

  // Ubah bagian ini
  var endTomorrow = new Date(startToday);
  endTomorrow.setDate(endTomorrow.getDate() + 1);
  var startTomorrow = new Date(startToday);
  startTomorrow.setDate(startTomorrow.getDate() + 1);
  startTomorrow.setHours(1, 0, 0, 0);
  endTomorrow.setHours(23, 59, 59, 999); // Set jam 23:59:59:999

  // Periksa apakah "endTomorrow" dan "endDayAfterTomorrow" tidak terdefinisi atau kosong
  if (!endTomorrow || isNaN(endTomorrow)) {
    // Jika kosong, atur "endTomorrow" menjadi "today + 2"
    endTomorrow = new Date(startToday);
    endTomorrow.setDate(endTomorrow.getDate() + 3);
    endTomorrow.setHours(23, 59, 59, 999); // Set jam 23:59:59:999
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
    var fibonacciLevels = [0, 0.236, 0.382, 0.5, 0.618, 1];

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
    var first_next = parseFloat(tomorrowsimulation[0].Open).toFixed(2);
    var uptrend = false;
    var downtrend = false;
    if (lowestLowIndex < highestHighIndex) {
      console.log("UPTREND");
      uptrend = true;
      addParagraphToAnalisa(`UPTREND`);
      if (fibo61 <= first_next <= fibo23) {
        addParagraphToAnalisa(`OPEN A`);
        console.log("OPEN A");
      } else if (fibo23 <= first_next <= fibo0) {
        addParagraphToAnalisa(`OPEN B`);
        console.log("OPEN B");
      } else if (fibo100 <= first_next <= fibo61) {
        addParagraphToAnalisa(`OPEN C`);
        console.log("OPEN C");
      }
    } else {
      console.log("DOWNTREND");
      addParagraphToAnalisa(`DOWNTREND`);
      downtrend = true;
      if (fibo61 >= first_next >= fibo23) {
        addParagraphToAnalisa(`OPEN A`);
        console.log("OPEN A");
      } else if (fibo23 >= first_next >= fibo0) {
        addParagraphToAnalisa(`OPEN B`);
        console.log("OPEN B");
      } else if (fibo100 >= first_next >= fibo61) {
        addParagraphToAnalisa(`OPEN C`);
        console.log("OPEN C");
      }
    }

    // Tampilkan nilai terendah, tertinggi, dan level Fibonacci pada console log
    console.log("Lowest Low:", lowestLow);
    console.log("Highest High:", highestHigh);
    console.log(
      "Lowest Low Time:",
      selectedAggregatedData[lowestLowIndex].Date
    );
    console.log(
      "Highest High Time:",
      selectedAggregatedData[highestHighIndex].Date
    );
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

    console.log(first_next);
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
    var keypip = 1.55;
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
    var a2a = parseFloat(0.0).toFixed(2);
    var a2atp = 0;
    var a2atp1 = 0;
    var a2atp2 = 0;
    var a2atp3 = 0;
    var a2atp4 = 0;
    var a2atp5 = 0;
    var a2atp5 = 0;
    var a2b = parseFloat(0.0).toFixed(2);
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
    var tssell = 0;
    var tsbuy = 0;
    var enambelas = new Date();
    enambelas.setHours(16, 0, 0, 0);
    var sixteen = new Date();
    sixteen.setHours(18, 0, 0, 0);
    for (var i = 0; i < tomorrowsimulation.length; i++) {
      var minute = tomorrowsimulation[i].Date;
      var open_value = parseFloat(tomorrowsimulation[i].Open).toFixed(2);
      var low_value = parseFloat(tomorrowsimulation[i].Low).toFixed(2);
      var high_value = parseFloat(tomorrowsimulation[i].High).toFixed(2); // Fixed: changed to High instead of Low

      console.log(
        `Minute: ${minute}, Open: ${open_value}, High: ${high_value}, Low: ${low_value}`
      );

      if (counter == 4) {
        stop = true;
        break; // Use break instead of return to exit the loop
      }

      if (lowestLowIndex < highestHighIndex) {
        console.log("UPTREND");
        uptrend = true;
        // addParagraphToAnalisa(`UPTREND`);
        if (fibo61 <= first_next && first_next <= fibo23) {
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
          console.log(`a2a : ${a2a}`);
          console.log(`a2b : ${a2b}`);
          if (!stop_loss) {
            if (
              (open_value <= stoploss ||
                low_value <= stoploss ||
                high_value <= stoploss) &&
              buy
            ) {
              if (counter < 4) {
                if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                  stop_loss = true;
                  simulasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  buy_stop = true;
                  sell_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                } else if (
                  bep &&
                  (!tp1b || !tp2b || !tp3b || !tp4b || !tp5b || !tp6b)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  bep = false;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(stoploss - buystop).toFixed(2);
                  simulasi(hasil);
                }
              } else if (tp1b || tp2b || tp3b || tp4b || tp5b || tp6b) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                break;
              } else {
                stop_loss = true;
                simulasi(`STOP LOSS : ${stoploss}`);
                hasil = parseFloat(stoploss - buystop).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                break;
              }
            }
            if (
              (open_value >= stoploss ||
                low_value >= stoploss ||
                high_value >= stoploss) &&
              sell
            ) {
              if (counter < 4) {
                if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                  stop_loss = true;
                  simlasi(`TRAIL STOP : ${stoploss}`);
                  sell_stop = false;
                  buy_stop = false;
                  hasil = parseFloat(sellstop - stoploss);
                  simulasi(hasil);
                } else if (minute.getHours() >= enambelas.getHours()) {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  buy_stop = true;
                  sell_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                  simulasi(counter);
                } else if (
                  bep &&
                  (!tp1s || !tp2s || !tp3s || !tp4s || !tp5s || !tp6s)
                ) {
                  stop_loss = true;
                  simulasi(`BEP AT : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  bep = false;
                } else {
                  stop_loss = true;
                  simulasi(`STOP LOSS : ${stoploss}`);
                  sell_stop = true;
                  buy_stop = true;
                  hasil = parseFloat(sellstop - stoploss).toFixed(2);
                  simulasi(hasil);
                }
              } else if (tp1s || tp2s || tp3s || tp4s || tp5s || tp6s) {
                stop_loss = true;
                simulasi(`TRAIL STOP : ${stoploss}`);
                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
              } else {
                stop_loss = true;
                hasil = parseFloat(sellstop - stoploss).toFixed(2);
                simulasi(hasil);
                simulasi(counter);
                break;
              }
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
                  console.log(`SELL STOP AT : ${sellstop}`);
                  simulasi(`SELL STOP AT : ${sellstop} in ${minute}`);
                  sell = true;
                  buy = false;
                  counter = counter + 1;
                  buy_stop = true;
                  buystop = a2a;
                  stoploss = buystop;
                  sell_stop = false;
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
                  console.log(`BUY STOP AT : ${buystop}`);
                  simulasi(`BUY STOP AT : ${buystop} in ${minute}`);
                  buy = true;
                  sell = false;
                  counter = counter + 1;
                  buy_stop = false;
                  sellstop = a2b;
                  stoploss = sellstop;
                  sell_stop = true;
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
              }
            }
          }
          if (minute.getHours() >= sixteen.getHours()) {
            simulasi(`OPEN : ${open_value}`);
            simulasi(counter);
            simulasi(`buy ${a2a}`);
            simulasi(`sell ${a2b}`);
            if (buy_stop && !sell_stop) {
              hasil = parseFloat(sellstop - open_value).toFixed(2);
              simulasi(`Close Jam 11 ${hasil}`);
              break;
            } else if (sell_stop && !buy_stop) {
              hasil = parseFloat(open_value - buystop).toFixed(2);
              simulasi(`Close Jam 11 ${hasil}`);
              break;
            }
            break;
          }
        } else if (fibo23 <= first_next && first_next <= fibo0) {
          addParagraphToAnalisa(`OPEN B`);
          console.log("OPEN B");
        } else if (fibo100 <= first_next && first_next <= fibo61) {
          addParagraphToAnalisa(`OPEN C`);
          console.log("OPEN C");
        }
      } else {
        console.log("DOWNTREND");
        addParagraphToAnalisa(`DOWNTREND`);
        downtrend = true;
        if (fibo61 >= first_next && first_next >= fibo23) {
          addParagraphToAnalisa(`OPEN A`);
          console.log("OPEN A");
        } else if (fibo23 >= first_next && first_next >= fibo0) {
          addParagraphToAnalisa(`OPEN B`);
          console.log("OPEN B");
        } else if (fibo100 >= first_next && first_next >= fibo61) {
          addParagraphToAnalisa(`OPEN C`);
          console.log("OPEN C");
        }
      }
    }
  });
}

// Fungsi untuk mencari nilai terendah pada kolom "Low"
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

// Panggil fungsi untuk memvalidasi dan menampilkan chart
// validateAndPlot();

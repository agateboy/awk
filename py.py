import mplfinance as mpf
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

# Load your intraday data
intraday = pd.read_csv('2021f.csv', index_col=0, parse_dates=True)
intraday = intraday.drop('Volume', axis=1)  # Volume is zero anyway for this intraday data set

# Specify the date range for iday
start_date = '11-11-2021 01:00'
end_date = '11-11-2021 23:59'
startday = start_date
endday  = end_date
def main():
  # Select the data for the specified date
  iday = intraday.loc[startday:endday, :]

  # Define a function to convert values to floats
  def to_float(value):
      try:
          return float(value)
      except ValueError:
          return None

  # Convert the 'Close' and 'Low' columns to floats
  iday['Close'] = iday['Close'].apply(to_float)
  iday['Low'] = iday['Low'].apply(to_float)

  # Resample the data to 1-hour intervals
  iday_resampled = iday.resample('1H').agg({'Open': 'first', 'High': 'max', 'Low': 'min', 'Close': 'last'})

  # Find the highest float value in each row of column 2 in 'iday_resampled'
  highest_values_in_col_2 = iday_resampled.iloc[:, 1].apply(to_float)
  highest_float_value = highest_values_in_col_2.max()
  highest_value_row = highest_values_in_col_2.idxmax()
  highest_value_index = iday_resampled.index.get_loc(highest_value_row)

  # Find the weakest (lowest) float value in each row of column 3 in 'iday_resampled'
  weakest_values_in_col_3 = iday_resampled.iloc[:, 2].apply(to_float)
  weakest_float_value = weakest_values_in_col_3.min()
  weakest_value_row = weakest_values_in_col_3.idxmin()
  weakest_value_index = iday_resampled.index.get_loc(weakest_value_row)

  # Display the float values with 2 decimal places
  formatted_highest_value = float('{:.2f}'.format(highest_float_value))
  formatted_weakest_value = float('{:.2f}'.format(weakest_float_value))
  print("High:")
  print(formatted_highest_value)
  print("Low:")
  print(formatted_weakest_value)

  # Create a new figure and axis for the plot
  fig, ax = plt.subplots()

  # Plot the candlesticks for 1-hour intervals
  mpf.plot(iday_resampled, type='candle', mav=(60, 60), ax=ax)

  # Define the ranges for A, B, C, D, and E
  ranges = [
      {'label': 'A', 'min_percent': 0, 'max_percent': 23},
      {'label': 'B', 'min_percent': 23, 'max_percent': 38},
      {'label': 'C', 'min_percent': 38, 'max_percent': 50},
      {'label': 'D', 'min_percent': 50, 'max_percent': 61},
      {'label': 'E', 'min_percent': 61, 'max_percent': 100}
  ]

  # Determine if 100% should be at the weakest or highest value
  if weakest_value_index < highest_value_index:
      full_range_high = formatted_weakest_value
      full_range_low = formatted_highest_value
  else:
      full_range_high = formatted_highest_value
      full_range_low = formatted_weakest_value

  # Get the opening price for the first hour
  first_hour = iday_resampled.iloc[0, 0]

  # Initialize lists to store the values for each range
  range_values = {r['label']: [] for r in ranges}

  # Print the range definitions and their respective high and low values
  for r in ranges:
      min_value = (full_range_high - full_range_low) * r['min_percent'] / 100 + full_range_low
      max_value = (full_range_high - full_range_low) * r['max_percent'] / 100 + full_range_low
      print(f"Range {r['label']} ({r['min_percent']}% - {r['max_percent']}%):")
      print(f"High: {max_value:.2f}")
      print(f"Low: {min_value:.2f}")

      # Store the values for each range
      range_values[r['label']] = [min_value, max_value]

      # Add a horizontal line for each range
      ax.axhline(max_value, linestyle='--', label=f'{r["label"]} ({r["min_percent"]}-{r["max_percent"]}%)', color='r')
      ax.axhline(min_value, linestyle='--', color='r')

  print(f"Harga Open: {first_hour:.2f}")
  if full_range_high > full_range_low:
    print("Down Trend")
    DownTrend = True
    UpTrend = False
    fibo0 = range_values['A'][0]
    fibo23 = range_values['A'][1]
    fibo38 = range_values['B'][1]
    fibo50 = range_values['C'][1]
    fibo61 = range_values['D'][1]
    fibo100 = range_values['E'][1]
  else:
    print("Up Trend")
    UpTrend = True
    DownTrend = False
    fibo0 = range_values['A'][0]
    fibo23 = range_values['A'][1]
    fibo38 = range_values['B'][1]
    fibo50 = range_values['C'][1]
    fibo61 = range_values['D'][1]
    fibo100 = range_values['E'][1]
  # Now you can access the values for each range using range_values

  # Calculate the date for one day after
  nextstart = datetime.strptime(start_date, '%m-%d-%Y %H:%M')
  nextend = datetime.strptime(end_date, '%m-%d-%Y %H:%M')
  next_start = nextstart + timedelta(days=1)
  next_end = nextend + timedelta(days=1)
  if next_start not in intraday.index:
    next_start = nextstart + timedelta(days=2)
    next_end = nextend + timedelta(days=2)
    print("NO DATA")
    output_str = next_start.strftime('%m-%d-%Y %H:%M')
    print(output_str)
    next_day_data = intraday.loc[next_start:next_end, :]
    if next_start not in intraday.index:
      next_start = nextstart + timedelta(days=3)
      next_end = nextend + timedelta(days=3)
      print("NO DATA")
      output_str = next_start.strftime('%m-%d-%Y %H:%M')
      print(output_str)
      next_day_data = intraday.loc[next_start:next_end, :]
    elif next_start in intraday.index:
      next_day_data = intraday.loc[next_start:next_end, :]
  elif next_start in intraday.index:
    next_day_data = intraday.loc[next_start:next_end, :]

  # Resample the next day data to 1-minute intervals (change to '1T' for 1-minute intervals)
  next_day_resampled = next_day_data.resample('1H').agg({'Open': 'first', 'High': 'max', 'Low': 'min', 'Close': 'last'})
  next_day_plot = next_day_resampled.resample('1H').agg({'Open': 'first', 'High': 'max', 'Low': 'min', 'Close': 'last'})
  next_day_sim = next_day_data.resample('1T').agg({'Open': 'first', 'High': 'max', 'Low': 'min', 'Close': 'last'})
  first_next = next_day_resampled.iloc[0, 0]

  fig_next_day, ax_next_day = plt.subplots()

  # Plot the candlesticks for the next day with a 1-hour interval
  mpf.plot(next_day_resampled, type='candle', mav=(60, 60), ax=ax_next_day)

  # Re-display the previous day's range definitions on the next day's plot
  for r in ranges:
    min_value = (full_range_high - full_range_low) * r['min_percent'] / 100 + full_range_low
    max_value = (full_range_high - full_range_low) * r['max_percent'] / 100 + full_range_low
    if min_value < first_next < max_value or min_value > first_next > max_value:
        x = r['label']
    # Add a horizontal line for each range on the next day's plot
    ax_next_day.axhline(max_value, linestyle='--', label=f'{r["label"]} ({r["min_percent"]}-{r["max_percent"]}%)', color='r')
    ax_next_day.axhline(min_value, linestyle='--', color='r')

  print(f"Harga Open : {first_next} in Range {x}")

  sell_stop = False
  sell_limit = False
  sell_stop2 = False
  buy_stop2 = False
  loss = False
  buy_stop = False
  buy_limit = False
  cut_loss = False
  stop = False
  trail = 4
  counter = 0
  keypip = 1.55
  sphread = 0.50
  buy = False
  sell = False
  setopen = False
  tp1b = False
  tp2b = False
  tp3b = False
  tp4b = False
  tp5b = False
  tp6b = False
  tp7b = False  
  tp1s = False
  tp2s = False
  tp3s = False
  tp4s = False
  tp5s = False
  tp6s = False
  tp7s = False  
  b1a = 0
  b1b = 0
  b1c = 0
  b1d = 0
  b1tp = 0
  b1tp1 = 0
  b1tp2 = 0
  b1tp3 = 0
  b1tp4 = 0
  b1tp5 = 0
  b2a = 0
  b2b = 0
  b2c = 0
  b2d = 0
  b2tp = 0
  b2tp1 = 0
  b2tp2 = 0
  b2tp3 = 0
  b2tp4 = 0
  b2tp5 = 0
  a1a = 0
  a1atp = 0
  a1atp1 = 0
  a1atp2 = 0
  a1atp3 = 0
  a1atp4 = 0
  a1atp5 = 0
  a1b = 0
  a1btp = 0
  a1btp1 = 0
  a1btp2 = 0
  a1btp3 = 0
  a1btp4 = 0
  a1btp5 = 0
  a2a = 0
  a2atp = 0
  a2atp1 = 0
  a2atp2 = 0
  a2atp3 = 0
  a2atp4 = 0
  a2atp5 = 0
  a2b = 0
  a2btp = 0
  a2btp1 = 0
  a2btp2 = 0
  a2btp3 = 0
  a2btp4 = 0
  a2btp5 = 0
  c1a = 0
  c1b = 0
  c1c = 0
  c1d = 0
  c1tp = 0
  c1tp1 = 0
  c1tp2 = 0
  c1tp3 = 0
  c1tp4 = 0
  c1tp5 = 0
  c2a = 0
  c2b = 0
  c2c = 0
  c2d = 0
  c2tp = 0
  c2tp1 = 0
  c2tp2 = 0
  c2tp3 = 0
  c2tp4 = 0
  c2tp5 = 0
  tpbuy = False
  stop_loss = False
  stoploss = 0
  trail_stop = False
  trail_count = 0
  trailmode = False
  bep = False 
  selisihbep = 0
  selisihts = 0
  tsbuy = 0
  tssell = 0
  # Now you can access the values for each range using range_values
  for index, row in next_day_sim.iterrows():
      minute = index.strftime('%H:%M')
      open_value = to_float(row['Open'])
      low_value = to_float(row['Low'])
      high_value = to_float(row['High'])
      print(f"Minute: {minute}, Open: {open_value:.2f}, High: {high_value:.2f}, Low: {low_value:.2f}")
      if counter == 4:
        stop = True
      # time.sleep(0.05)

      # PROGRAM B
      if fibo0 >= first_next >= fibo23 or fibo0 <= first_next <= fibo23:
        if UpTrend :
          selisihbep = float('{:.2f}'.format(fibo61-fibo100))
          b2a = ((fibo0+fibo23)/2)-keypip
          b2b = fibo0-keypip
          b2c = fibo23-keypip
          b2d = fibo0+keypip+sphread
          b2tp = fibo100+keypip+sphread
          b2tp1 = b2tp-trail
          b2tp2 = b2tp1-trail
          b2tp3 = b2tp2-trail
          b2tp4 = b2tp3-trail
          b2tp5 = b2tp4-trail
          b2tp6 = b2tp5-trail
          ts = float('{:.2f}'.format(tsbuy-keypip))
          ts1 = ts+4
          ts2 = ts1+4
          ts3 = ts2+4
          ts4 = ts3+4
          ts5 = ts4+4
          ts6 = ts5+4
          selisihts = float('{:.2f}'.format(b2c-fibo100))
          tsbuy = float('{:.2f}'.format(b2d + selisihts))
          bepbuy = float('{:.2f}'.format(tsbuy - selisihbep))
          # print(f"TrailStop {tsbuy}")
          # print(f"Buy Stop {b2d}")
          # print(f"Sell Stop {b2c}")
          # print(f"TrailStop {b2tp}")

          if not stop_loss:              
            if (open_value <= stoploss or low_value <= stoploss or high_value <= stoploss) and buy:
              if counter < 4:
                if (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):           
                  stop_loss = True
                  print(f"TRAIL STOP : {stoploss} ")
                  sell_stop = False
                  buy_stop = False
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)
                elif index.time() >= pd.to_datetime('16:00').time():
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)  
                  print(counter)   
                  break
                elif bep and not (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):
                  stop_loss = True
                  # print(f"STOP LOSS : {stoploss}")
                  print(f"BEP AT : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  bep = False                 
                else :
                  stop_loss = True
                  print(f"STOP LOSS: {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)       
              elif (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):
                stop_loss = True
                print(f"TRAIL STOP : {stoploss}")
                hasil = float('{:.2f}'.format(stoploss - buystop))
                print(hasil) 
                print(counter)
                break           
              else:
                stop_loss = True
                print(f"STOP LOSS : {stoploss}")
                hasil = float('{:.2f}'.format(stoploss - buystop))
                print(hasil) 
                print(counter) 
                break
            elif (open_value >= stoploss or low_value >= stoploss or high_value >= stoploss) and sell:
              if counter < 4:
                if (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):                
                  stop_loss = True
                  print(f"TRAIL STOP : {stoploss} ")
                  sell_stop = False
                  buy_stop = False
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)
                elif index.time() >= pd.to_datetime('16:00').time():
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)  
                  print(counter)   
                  break
                elif bep and not (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):
                  stop_loss = True
                  # print(f"STOP LOSS : {stoploss}")
                  print(f"BEP AT : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  bep = False               
                else :
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)   
              elif (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):
                stop_loss = True
                print(f"TRAIL STOP : {stoploss}")
                hasil = float('{:.2f}'.format(sellstop - stoploss))
                print(hasil) 
                print(counter)                
              else:
                stop_loss = True
                print(f"STOP LOSS : {stoploss}")
                hasil = float('{:.2f}'.format(sellstop - stoploss))
                print(hasil) 
                print(counter)   
                break                      
          if b2d >= open_value >= b2c:
            if not setopen:
              sellstop = float('{:.2f}'.format(b2c))
              print(f"SELL STOP : {sellstop}")
              sell_stop = True
              buystop = float('{:.2f}'.format(b2d))
              print(f"BUY STOP : {buystop}")
              buy_stop = True
              setopen = True
            elif setopen:
              if (open_value <= b2c or low_value <= b2c or high_value <= b2c):
                if counter >= 4:
                  buy_stop = False
                  sell_stop = False
                elif index.time() >= pd.to_datetime('16:00').time() and not (buy_stop or sell_stop):
                  sell_stop = False
                  buy_stop = False                
                elif sell_stop and not sell:
                  stop_loss = False
                  print(f"SELL STOP AT: {sellstop}")
                  sell = True
                  buy = False
                  counter = counter+1
                  buy_stop = True
                  # buystop = float('{:.2f}'.format(b2d))
                  sell_stop = False
                  stoploss = buystop
                  bep = False
                  #-----------------------------------------------------------
              elif (open_value >= b2d or low_value >= b2d or high_value >= b2d):
                if counter >= 4:
                  buy_stop = False
                  sell_stop = False
                elif index.time() >= pd.to_datetime('16:00').time() and not (buy_stop or sell_stop):
                  sell_stop = False
                  buy_stop = False                
                elif buy_stop and not buy:
                  stop_loss = False                  
                  print(f"BUY STOP AT: {buystop}")
                  sell = False
                  buy = True
                  counter = counter+1
                  sell_stop = True
                  # buystop = float('{:.2f}'.format(b2c))
                  buy_stop = False
                  stoploss = sellstop
                  bep = False
                  #-----------------------------------------------------------
          if sell:
            if (open_value <= fibo100 or low_value <= fibo100 or high_value <= fibo100):            
              if (open_value <= b2tp6 or low_value <= b2tp6 or high_value <= b2tp6):
                  tp7s = True
              elif (open_value <= b2tp5 or low_value <= b2tp5 or high_value <= b2tp5):
                  tp6s = True
              elif (open_value <= b2tp4 or low_value <= b2tp4 or high_value <= b2tp4):
                  tp5s = True
              elif (open_value <= b2tp3 or low_value <= b2tp3 or high_value <= b2tp3):
                  tp4s = True
              elif (open_value <= b2tp2 or low_value <= b2tp2 or high_value <= b2tp2):
                  tp3s = True
              elif (open_value <= b2tp1 or low_value <= b2tp1 or high_value <= b2tp1):
                  tp2s = True
              elif (open_value <= b2tp or low_value <= b2tp or high_value <= b2tp):
                  tp1s = True
              if tp7s:
                stoploss = float('{:.2f}'.format(b2tp5))                  
              elif tp6s:
                  stoploss = float('{:.2f}'.format(b2tp4))
              elif tp5s:
                  stoploss = float('{:.2f}'.format(b2tp3))
              elif tp4s:
                  stoploss = float('{:.2f}'.format(b2tp2))
              elif tp3s:
                  stoploss = float('{:.2f}'.format(b2tp1))
              elif tp2s:
                  stoploss = float('{:.2f}'.format(b2tp))
              elif tp1s:
                  stoploss = float('{:.2f}'.format(b2tp))
            elif (open_value <= fibo61 or low_value <= fibo61 or high_value <= fibo61):
              bep = True
              stoploss = float('{:.2f}'.format(sellstop))  

          elif buy:
            if (open_value >= tsbuy or low_value >= tsbuy or high_value >= tsbuy):
              if (open_value >= ts6 or low_value >= ts6 or high_value >= ts6):
                  tp7b = True              
              elif (open_value >= ts5 or low_value >= ts5 or high_value >= ts5):
                  tp6b = True
              elif (open_value >= ts4 or low_value >= ts4 or high_value >= ts4):
                  tp5b = True
              elif (open_value >= ts3 or low_value >= ts3 or high_value >= ts3):
                  tp4b = True
              elif (open_value >= ts2 or low_value >= ts2 or high_value >= ts2):
                  tp3b = True
              elif (open_value >= ts1 or low_value >= ts1 or high_value >= ts1):
                  tp2b = True
              elif (open_value >= ts or low_value >= ts or high_value >= ts):
                  tp1b = True
              if tp7b:
                  stoploss = float('{:.2f}'.format(ts5))
              elif tp6b:
                  stoploss = float('{:.2f}'.format(ts4))
              elif tp5b:
                  stoploss = float('{:.2f}'.format(ts3))
              elif tp4b:
                  stoploss = float('{:.2f}'.format(ts2))
              elif tp3b:
                  stoploss = float('{:.2f}'.format(ts1))
              elif tp2b:
                  stoploss = float('{:.2f}'.format(ts))
              elif tp1b:
                  stoploss = float('{:.2f}'.format(ts))
            elif (open_value >= bepbuy or low_value >= bepbuy or high_value >= bepbuy) and not bep:
              bep = True
              stoploss = float('{:.2f}'.format(buystop))

          if index.time() >= pd.to_datetime('16:00').time() and counter == 0:
            sell_stop = False
            buy_stop = False            
          if index.time() >= pd.to_datetime('18:00').time():
            # if not sell_stop and not buy_stop:
            print(f"OPEN : {open_value}")
            print(counter)
            print(f"buy {buystop}")
            print(f"sell {sellstop}")
            print(tp1b, tp2b, tp3b, tp4b, tp5b, tp6b)
            print(bep)
            if buy_stop and not sell_stop :  
              hasil = float('{:.2f}'.format(sellstop - open_value))
              print(f"Close Jam 11 {hasil}")
              break
            elif sell_stop and not buy_stop:
              hasil = float('{:.2f}'.format(open_value - buystop))
              print(f"Close Jam 11 {hasil}")
              break
            break              
  #--------------------------------------------------------------------------------
        elif DownTrend:
          selisihbep = float('{:.2f}'.format(fibo100-fibo61))
          b1a = ((fibo0+fibo23)/2)+keypip+sphread
          b1b = fibo0+keypip+sphread
          b1c = fibo0-keypip
          b1d = fibo23+keypip+sphread
          b1tp = fibo100-keypip
          b1tp1 = b1tp+trail
          b1tp2 = b1tp1+trail
          b1tp3 = b1tp2+trail
          b1tp4 = b1tp3+trail
          b1tp5 = b1tp4+trail
          b1tp6 = b1tp5+trail
          ts = float('{:.2f}'.format(tssell+keypip+sphread))
          ts1 = ts-4
          ts2 = ts1-4
          ts3 = ts2-4
          ts4 = ts3-4
          ts5 = ts4-4
          ts6 = ts5-4          
          selisihts = float('{:.2f}'.format(fibo100-b1d))
          tssell = float('{:.2f}'.format(b1c - selisihts))
          bepsell = float('{:.2f}'.format(tssell+selisihbep))          
          if not stop_loss:              
            if (open_value <= stoploss or low_value <= stoploss or high_value <= stoploss) and buy:
              if counter < 4:
                if (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):           
                  stop_loss = True
                  print(f"TRAIL STOP : {stoploss} ")
                  sell_stop = False
                  buy_stop = False
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)
                elif index.time() >= pd.to_datetime('16:00').time():
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)  
                  print(counter)   
                  break
                elif bep and not (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):
                  stop_loss = True
                  # print(f"STOP LOSS : {stoploss}")
                  print(f"BEP AT : {stoploss}")
                  sell_stop = False
                  buy_stop = False 
                  bep = False                 
                else :
                  stop_loss = True
                  print(f"STOP LOSS: {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)       
              elif (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):
                stop_loss = True
                print(f"TRAIL STOP : {stoploss}")
                hasil = float('{:.2f}'.format(stoploss - buystop))
                print(hasil) 
                print(counter)
                break           
              else:
                stop_loss = True
                print(f"STOP LOSS : {stoploss}")
                hasil = float('{:.2f}'.format(stoploss - buystop))
                print(hasil) 
                print(counter) 
                break
            elif (open_value >= stoploss or low_value >= stoploss or high_value >= stoploss) and sell:
              if counter < 4:
                if (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):                
                  stop_loss = True
                  print(f"TRAIL STOP : {stoploss} ")
                  sell_stop = False
                  buy_stop = False
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)
                elif index.time() >= pd.to_datetime('16:00').time():
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)  
                  print(counter)   
                  break
                elif bep and not (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):
                  stop_loss = True
                  # print(f"STOP LOSS : {stoploss}")
                  print(f"BEP AT : {stoploss}")
                  sell_stop = False
                  buy_stop = False 
                  bep = False               
                else :
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)   
              elif (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):
                stop_loss = True
                print(f"TRAIL STOP : {stoploss}")
                hasil = float('{:.2f}'.format(sellstop - stoploss))
                print(hasil) 
                print(counter)                
              else:
                stop_loss = True
                print(f"STOP LOSS : {stoploss}")
                hasil = float('{:.2f}'.format(sellstop - stoploss))
                print(hasil) 
                print(counter)   
                break
          if b1d >= open_value >= b1c:
            if not setopen:
              sellstop = float('{:.2f}'.format(b1c))
              print(f"SELL STOP : {sellstop}")
              sell_stop = True
              buystop = float('{:.2f}'.format(b1d))
              print(f"BUY STOP : {buystop}")
              buy_stop = True
              setopen = True              
            elif setopen:
              if (open_value <= b1c or low_value <= b1c or high_value <= b1c):
                if counter >= 4:
                  buy_stop = False
                  sell_stop = False
                elif index.time() >= pd.to_datetime('16:00').time() and not (buy_stop or sell_stop):
                  sell_stop = False
                  buy_stop = False
                elif sell_stop and not sell:
                  stop_loss = False
                  print(f"SELL STOP AT : {sellstop}")
                  sell = True
                  buy = False
                  counter = counter+1
                  buy_stop = True
                  stoploss = buystop
                  # print(f"BUY STOP : {buystop}")
                  sell_stop = False
                  bep = False
              elif (open_value >= b1d or low_value >= b1d or high_value >= b1d):
                if counter >= 4:
                  buy_stop = False
                  sell_stop = False
                elif index.time() >= pd.to_datetime('16:00').time() and not (buy_stop or sell_stop):
                  sell_stop = False
                  buy_stop = False
                elif buy_stop and not buy:
                  stop_loss = False
                  print(f"BUY STOP AT : {buystop}")
                  buy = True
                  sell = False
                  counter = counter + 1
                  buy_stop = False
                  stoploss = sellstop
                  # print(f"SELL STOP : {sellstop}")
                  sell_stop = True
                  bep = False
                  #-----------------------------------------------------------
          if sell:
            if (open_value <= tssell or low_value <= tssell or high_value <= tssell):            
              if (open_value <= ts6 or low_value <= ts6 or high_value <= ts6):
                  tp7s = True
              elif (open_value <= ts5 or low_value <= ts5 or high_value <= ts5):
                  tp6s = True
              elif (open_value <= ts4 or low_value <= ts4 or high_value <= ts4):
                  tp5s = True
              elif (open_value <= ts3 or low_value <= ts3 or high_value <= ts3):
                  tp4s = True
              elif (open_value <= ts2 or low_value <= ts2 or high_value <= ts2):
                  tp3s = True
              elif (open_value <= ts1 or low_value <= ts1 or high_value <= ts1):
                  tp2s = True
              elif (open_value <= ts or low_value <= ts or high_value <= ts):
                  tp1s = True
              if tp7s:
                stoploss = float('{:.2f}'.format(ts5))                  
              elif tp6s:
                  stoploss = float('{:.2f}'.format(ts4))
              elif tp5s:
                  stoploss = float('{:.2f}'.format(ts3))
              elif tp4s:
                  stoploss = float('{:.2f}'.format(ts2))
              elif tp3s:
                  stoploss = float('{:.2f}'.format(ts1))
              elif tp2s:
                  stoploss = float('{:.2f}'.format(ts))
              elif tp1s:
                  stoploss = float('{:.2f}'.format(ts))
            elif (open_value <= bepsell or low_value <= bepsell or high_value <= bepsell):
              bep = True
              stoploss = float('{:.2f}'.format(sellstop))  
          elif buy:
            if (open_value >= fibo100 or low_value >= fibo100 or high_value >= fibo100):            
              if (open_value >= b1tp6 or low_value >= b1tp6 or high_value >= b1tp6):
                  tp7b = True
              elif (open_value >= b1tp5 or low_value >= b1tp5 or high_value >= b1tp5):
                  tp6b = True
              elif (open_value >= b1tp4 or low_value >= b1tp4 or high_value >= b1tp4):
                  tp5b = True
              elif (open_value >= b1tp3 or low_value >= b1tp3 or high_value >= b1tp3):
                  tp4b = True
              elif (open_value >= b1tp2 or low_value >= b1tp2 or high_value >= b1tp2):
                  tp3b = True
              elif (open_value >= b1tp1 or low_value >= b1tp1 or high_value >= b1tp1):
                  tp2b = True
              elif (open_value >= b1tp or low_value >= b1tp or high_value >= b1tp):
                  tp1b = True
              if tp7b:
                  stoploss = float('{:.2f}'.format(b1tp5))
              elif tp6b:
                  stoploss = float('{:.2f}'.format(b1tp4))
              elif tp5b:
                  stoploss = float('{:.2f}'.format(b1tp3))
              elif tp4b:
                  stoploss = float('{:.2f}'.format(b1tp2))
              elif tp3b:
                  stoploss = float('{:.2f}'.format(b1tp1))
              elif tp2b:
                  stoploss = float('{:.2f}'.format(b1tp))
              elif tp1b:
                  stoploss = float('{:.2f}'.format(b1tp))
            elif (open_value >= fibo61 or low_value >= fibo61 or high_value >= fibo61):
              bep = True
              stoploss = float('{:.2f}'.format(buystop))   

          if index.time() >= pd.to_datetime('16:00').time() and counter == 0:
            sell_stop = False
            buy_stop = False            
          if index.time() >= pd.to_datetime('18:00').time():
            # if not sell_stop and not buy_stop:
            print(f"OPEN : {open_value}")
            print(counter)
            print(f"buy {buystop}")
            print(f"sell {sellstop}")
            if buy_stop and not sell_stop :  
              hasil = float('{:.2f}'.format(sellstop - open_value))
              print(f"Close Jam 11 {hasil}")
              break
            elif sell_stop and not buy_stop:
              hasil = float('{:.2f}'.format(open_value - buystop))
              print(f"Close Jam 11 {hasil}")
              break
            break
               

#--------------------------------------------------------------------------------
      #--------------------------------------------------------------#
      #PROGRAM A
      elif fibo23 <= first_next <= fibo61 or fibo23 >= first_next >= fibo61:
        if UpTrend :
          selisihbep = float('{:.2f}'.format(fibo0-fibo23))
          tssell = float('{:.2f}'.format(fibo100-selisihbep))
          a2a = fibo50+keypip+sphread
          a2atp = fibo0-keypip
          a2atp1 = a2atp+trail
          a2atp2 = a2atp1+trail
          a2atp3 = a2atp2+trail
          a2atp4 = a2atp3+trail
          a2atp5 = a2atp4+trail
          a2atp6 = a2atp5+trail
          a2b = fibo50-keypip
          a2btp = fibo100+keypip+sphread
          a2btp1 = a2btp-trail
          a2btp2 = a2btp1-trail
          a2btp3 = a2btp2-trail
          a2btp4 = a2btp3-trail
          a2btp5 = a2btp4-trail
          a2btp6 = a2btp5-trail
          tsbuy = float('{:.2f}'.format(fibo0+selisihbep))
          if not stop_loss:
            if (open_value <= stoploss or low_value <= stoploss or high_value <= stoploss) and buy:
              if counter < 4:
                if (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):           
                  stop_loss = True
                  print(f"TRAIL STOP : {stoploss} ")
                  sell_stop = False
                  buy_stop = False
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)
                elif index.time() >= pd.to_datetime('16:00').time():
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)  
                  print(counter)   
                  break
                elif bep and not (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):
                  stop_loss = True
                  # print(f"STOP LOSS : {stoploss}")
                  print(f"BEP AT : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  bep = False                 
                else :
                  stop_loss = True
                  print(f"STOP LOSS: {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)       
              elif (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):
                stop_loss = True
                print(f"TRAIL STOP : {stoploss}")
                hasil = float('{:.2f}'.format(stoploss - buystop))
                print(hasil) 
                print(counter)
                break           
              else:
                stop_loss = True
                print(f"STOP LOSS : {stoploss}")
                hasil = float('{:.2f}'.format(stoploss - buystop))
                print(hasil) 
                print(counter) 
                break
            elif (open_value >= stoploss or low_value >= stoploss or high_value >= stoploss) and sell:
              if counter < 4:
                if (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):                
                  stop_loss = True
                  print(f"TRAIL STOP : {stoploss} ")
                  sell_stop = False
                  buy_stop = False
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)
                elif index.time() >= pd.to_datetime('16:00').time():
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)  
                  print(counter)   
                  break
                elif bep and not (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):
                  stop_loss = True
                  # print(f"STOP LOSS : {stoploss}")
                  print(f"BEP AT : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  bep = False               
                else :
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)   
              elif (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):
                stop_loss = True
                print(f"TRAIL STOP : {stoploss}")
                hasil = float('{:.2f}'.format(sellstop - stoploss))
                print(hasil) 
                print(counter)                
              else:
                stop_loss = True
                print(f"STOP LOSS : {stoploss}")
                hasil = float('{:.2f}'.format(sellstop - stoploss))
                print(hasil) 
                print(counter)   
                break          
          if a2a >= open_value >= a2b or a2a >= high_value >= a2b or a2a >= low_value >= a2b :
            if not setopen:
              sellstop = float('{:.2f}'.format(a2b))
              print(f"SELL STOP : {sellstop}")
              sell_stop = True
              buystop = float('{:.2f}'.format(a2a))
              print(f"BUY STOP : {buystop}")
              buy_stop = True
              setopen = True
            elif setopen:
              if (open_value <= a2b or low_value <= a2b or high_value <= a2b):
                if counter >= 4:
                  buy_stop = False
                  sell_stop = False
                elif index.time() >= pd.to_datetime('16:00').time():
                  sell_stop = False
                  buy_stop = False  
                elif sell_stop and not sell:
                  stop_loss = False
                  print(f"SELL STOP AT : {sellstop}")
                  sell = True
                  buy = False
                  counter = counter+1
                  buy_stop = True
                  buystop = float('{:.2f}'.format(a2a))
                  stoploss = buystop
                  # print(f"BUY STOP : {buystop}")
                  sell_stop = False
                  #---------------------------------------------------------
              elif (open_value >= a2a or low_value >= a2a or high_value >= a2a):
                if counter >= 4:
                  buy_stop = False
                  sell_stop = False
                elif index.time() >= pd.to_datetime('16:00').time():
                  sell_stop = False
                  buy_stop = False
                elif buy_stop and not buy:
                  stop_loss = False
                  print(f"BUY STOP AT : {buystop}")
                  buy = True
                  sell = False
                  counter = counter + 1
                  buy_stop = False
                  sellstop = float('{:.2f}'.format(a2b))
                  stoploss = sellstop
                  # print(f"SELL STOP : {sellstop}")
                  sell_stop = True
                  #----------------------------------------------------------
          if buy:
            if (open_value >= tsbuy or low_value >= tsbuy or high_value >= tsbuy):
              if (open_value >= a2atp6 or low_value >= a2atp6 or high_value >= a2atp6):
                  tp7b = True              
              elif (open_value >= a2atp5 or low_value >= a2atp5 or high_value >= a2atp5):
                  tp6b = True
              elif (open_value >= a2atp4 or low_value >= a2atp4 or high_value >= a2atp4):
                  tp5b = True
              elif (open_value >= a2atp3 or low_value >= a2atp3 or high_value >= a2atp3):
                  tp4b = True
              elif (open_value >= a2atp2 or low_value >= a2atp2 or high_value >= a2atp2):
                  tp3b = True
              elif (open_value >= a2atp1 or low_value >= a2atp1 or high_value >= a2atp1):
                  tp2b = True
              elif (open_value >= a2atp or low_value >= a2atp or high_value >= a2atp):
                  tp1b = True
              if tp7b:
                  stoploss = float('{:.2f}'.format(a2atp5))
              elif tp6b:
                  stoploss = float('{:.2f}'.format(a2atp4))
              elif tp5b:
                  stoploss = float('{:.2f}'.format(a2atp3))
              elif tp4b:
                  stoploss = float('{:.2f}'.format(a2atp2))
              elif tp3b:
                  stoploss = float('{:.2f}'.format(a2atp1))
              elif tp2b:
                  stoploss = float('{:.2f}'.format(a2atp))
              elif tp1b:
                  stoploss = float('{:.2f}'.format(a2atp))
            elif (open_value >= fibo0 or low_value >= fibo0 or high_value >= fibo0) and not bep:
              bep = True
              stoploss = float('{:.2f}'.format(buystop))                 

          elif sell:
            if (open_value <= tssell or low_value <= tssell or high_value <= tssell):            
              if (open_value <= a2btp6 or low_value <= a2btp6 or high_value <= a2btp6):
                  tp7s = True              
              elif (open_value <= a2btp5 or low_value <= a2btp5 or high_value <= a2btp5):
                  tp6s = True
              elif (open_value <= a2btp4 or low_value <= a2btp4 or high_value <= a2btp4):
                  tp5s = True
              elif (open_value <= a2btp3 or low_value <= a2btp3 or high_value <= a2btp3):
                  tp4s = True
              elif (open_value <= a2btp2 or low_value <= a2btp2 or high_value <= a2btp2):
                  tp3s = True
              elif (open_value <= a2btp1 or low_value <= a2btp1 or high_value <= a2btp1):
                  tp2s = True
              elif (open_value <= a2btp or low_value <= a2btp or high_value <= a2btp):
                  tp1s = True
              if tp7s:
                  stoploss = float('{:.2f}'.format(a2btp5))
              elif tp6s:
                  stoploss = float('{:.2f}'.format(a2btp4))
              elif tp5s:
                  stoploss = float('{:.2f}'.format(a2btp3))
              elif tp4s:
                  stoploss = float('{:.2f}'.format(a2btp2))
              elif tp3s:
                  stoploss = float('{:.2f}'.format(a2btp1))
              elif tp2s:
                  stoploss = float('{:.2f}'.format(a2btp))
              elif tp1s:
                  stoploss = float('{:.2f}'.format(a2btp))
            elif (open_value <= fibo100 or low_value <= fibo100 or high_value <= fibo100):
              bep = True
              stoploss = float('{:.2f}'.format(sellstop))                    

          if index.time() >= pd.to_datetime('16:00').time() and counter == 0:
            sell_stop = False
            buy_stop = False            
          if index.time() >= pd.to_datetime('18:00').time():
            # if not sell_stop and not buy_stop:
            print(f"OPEN : {open_value}")
            print(counter)
            print(f"buy {a2a}")
            print(f"sell {a2b}")
            if buy_stop and not sell_stop :  
              hasil = float('{:.2f}'.format(sellstop - open_value))
              print(f"Close Jam 11 {hasil}")
              break
            elif sell_stop and not buy_stop:
              hasil = float('{:.2f}'.format(open_value - buystop))
              print(f"Close Jam 11 {hasil}")
              break
            break
#---------------------------------------------------------------------               
        elif DownTrend :
          selisihbep = float('{:.2f}'.format(fibo23-fibo0))
          tssell = float('{:.2f}'.format(fibo0-selisihbep))          
          a1a = fibo50+keypip+sphread
          a1atp = tsbuy-keypip
          a1atp1 = a1atp+trail
          a1atp2 = a1atp1+trail
          a1atp3 = a1atp2+trail
          a1atp4 = a1atp3+trail
          a1atp5 = a1atp4+trail
          a1atp6 = a1atp5+trail
          a1b = fibo50-keypip
          a1btp = tssell+keypip+sphread
          a1btp1 = a1btp-trail
          a1btp2 = a1btp1-trail
          a1btp3 = a1btp2-trail
          a1btp4 = a1btp3-trail
          a1btp5 = a1btp4-trail
          a1btp6 = a1btp5-trail
          selisihts = float('{:.2f}'.format(a1b-tssell))
          tsbuy = float('{:.2f}'.format(fibo100+selisihbep))
          if not stop_loss:
            if (open_value <= stoploss or low_value <= stoploss or high_value <= stoploss) and buy:
              if counter < 4:
                if (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):           
                  stop_loss = True
                  print(f"TRAIL STOP : {stoploss} ")
                  sell_stop = False
                  buy_stop = False
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)
                elif index.time() >= pd.to_datetime('16:00').time():
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)  
                  print(counter)   
                  break
                elif bep and not (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):
                  stop_loss = True
                  # print(f"STOP LOSS : {stoploss}")
                  print(f"BEP AT : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  bep = False                 
                else :
                  stop_loss = True
                  print(f"STOP LOSS: {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)       
              elif (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):
                stop_loss = True
                print(f"TRAIL STOP : {stoploss}")
                hasil = float('{:.2f}'.format(stoploss - buystop))
                print(hasil) 
                print(counter)
                break           
              else:
                stop_loss = True
                print(f"STOP LOSS : {stoploss}")
                hasil = float('{:.2f}'.format(stoploss - buystop))
                print(hasil) 
                print(counter) 
                break
            elif (open_value >= stoploss or low_value >= stoploss or high_value >= stoploss) and sell:
              if counter < 4:
                if (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):                
                  stop_loss = True
                  print(f"TRAIL STOP : {stoploss} ")
                  sell_stop = False
                  buy_stop = False
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)
                elif index.time() >= pd.to_datetime('16:00').time():
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)  
                  print(counter)   
                  break
                elif bep and not (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):
                  stop_loss = True
                  # print(f"STOP LOSS : {stoploss}")
                  print(f"BEP AT : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  bep = False               
                else :
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)   
              elif (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):
                stop_loss = True
                print(f"TRAIL STOP : {stoploss}")
                hasil = float('{:.2f}'.format(sellstop - stoploss))
                print(hasil) 
                print(counter)                
              else:
                stop_loss = True
                print(f"STOP LOSS : {stoploss}")
                hasil = float('{:.2f}'.format(sellstop - stoploss))
                print(hasil) 
                print(counter)   
                break
          if a1a >= open_value >= a1b or a1a >= high_value >= a1b or a1a >= low_value >= a1b:
            if not setopen:
              sellstop = float('{:.2f}'.format(a1b))
              print(f"SELL STOP : {sellstop}")
              sell_stop = True
              buystop = float('{:.2f}'.format(a1a))
              print(f"BUY STOP : {buystop}")
              buy_stop = True
              setopen = True
            elif setopen:
              if (open_value <= a1b or low_value <= a1b or high_value <= a1b):
                if counter >= 4:
                  buy_stop = False
                  sell_stop = False
                elif index.time() >= pd.to_datetime('16:00').time() and not (buy_stop or sell_stop):
                  sell_stop = False
                  buy_stop = False  
                elif sell_stop and not sell:
                  stop_loss = False
                  print(f"SELL STOP AT : {sellstop}")
                  sell = True
                  buy = False
                  counter = counter+1
                  buy_stop = True
                  buystop = float('{:.2f}'.format(a1a))
                  stoploss = buystop
                  # print(f"BUY STOP : {buystop}")
                  sell_stop = False
                  #---------------------------------------------------------
              elif (open_value >= a1a or low_value >= a1a or high_value >= a1a):
                if counter >= 4:
                  buy_stop = False
                  sell_stop = False
                elif index.time() >= pd.to_datetime('16:00').time() and not (buy_stop or sell_stop):
                  sell_stop = False
                  buy_stop = False
                elif buy_stop and not buy:
                  stop_loss = False
                  print(f"BUY STOP AT : {buystop}")
                  buy = True
                  sell = False
                  counter = counter + 1
                  buy_stop = False
                  sellstop = float('{:.2f}'.format(a1b))
                  stoploss = sellstop
                  # print(f"SELL STOP : {sellstop}")
                  sell_stop = True
                  #----------------------------------------------------- 
#++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#----------------------------------------------------------------------------------------
          if buy :
            if (open_value >= tsbuy or low_value >= tsbuy or high_value >= tsbuy):
              if (open_value >= a1atp6 or low_value >= a1atp6 or high_value >= a1atp6):
                  tp7b = True              
              elif (open_value >= a1atp5 or low_value >= a1atp5 or high_value >= a1atp5):
                  tp6b = True
              elif (open_value >= a1atp4 or low_value >= a1atp4 or high_value >= a1atp4):
                  tp5b = True
              elif (open_value >= a1atp3 or low_value >= a1atp3 or high_value >= a1atp3):
                  tp4b = True
              elif (open_value >= a1atp2 or low_value >= a1atp2 or high_value >= a1atp2):
                  tp3b = True
              elif (open_value >= a1atp1 or low_value >= a1atp1 or high_value >= a1atp1):
                  tp2b = True
              elif (open_value >= a1atp or low_value >= a1atp or high_value >= a1atp):
                  tp1b = True
              if tp7b:
                  stoploss = float('{:.2f}'.format(a1atp5))                  
              elif tp6b:
                  stoploss = float('{:.2f}'.format(a1atp4))
              elif tp5b:
                  stoploss = float('{:.2f}'.format(a1atp3))
              elif tp4b:
                  stoploss = float('{:.2f}'.format(a1atp2))
              elif tp3b:
                  stoploss = float('{:.2f}'.format(a1atp1))
              elif tp2b:
                  stoploss = float('{:.2f}'.format(a1atp))
              elif tp1b:
                  stoploss = float('{:.2f}'.format(a1atp))
            elif (open_value >= fibo100 or low_value >= fibo100 or high_value >= fibo100) and not bep:
              bep = True
              stoploss = float('{:.2f}'.format(buystop))             

              # break

          elif sell :
            if (open_value <= tssell or low_value <= tssell or high_value <= tssell):
              if (open_value <= a1btp6 or low_value <= a1btp6 or high_value <= a1btp6):
                  tp7s = True              
              elif (open_value <= a1btp5 or low_value <= a1btp5 or high_value <= a1btp5):
                  tp6s = True
              elif (open_value <= a1btp4 or low_value <= a1btp4 or high_value <= a1btp4):
                  tp5s = True
              elif (open_value <= a1btp3 or low_value <= a1btp3 or high_value <= a1btp3):
                  tp4s = True
              elif (open_value <= a1btp2 or low_value <= a1btp2 or high_value <= a1btp2):
                  tp3s = True
              elif (open_value <= a1btp1 or low_value <= a1btp1 or high_value <= a1btp1):
                  tp2s = True
              elif (open_value <= a1btp or low_value <= a1btp or high_value <= a1btp):
                  tp1s = True
              if tp7s:
                  stoploss = float('{:.2f}'.format(a1btp5))                  
              elif tp6s:
                  stoploss = float('{:.2f}'.format(a1btp4))
              elif tp5s:
                  stoploss = float('{:.2f}'.format(a1btp3))
              elif tp4s:
                  stoploss = float('{:.2f}'.format(a1btp2))
              elif tp3s:
                  stoploss = float('{:.2f}'.format(a1btp1))
              elif tp2s:
                  stoploss = float('{:.2f}'.format(a1btp))
              elif tp1s:
                  stoploss = float('{:.2f}'.format(a1btp))                                  
            elif (open_value <= fibo0 or low_value <= fibo0 or high_value <= fibo0) and not bep:
              bep = True
              stoploss = float('{:.2f}'.format(sellstop)) 
                               
                  
          # if counter >= 4:
          #   buy_stop = False
          #   sell_stop = False
          # if index.time() >= pd.to_datetime('16:00').time():
          #   sell_stop = False
          #   buy_stop = False   
          if index.time() >= pd.to_datetime('16:00').time() and counter == 0:
            sell_stop = False
            buy_stop = False                      
          if index.time() >= pd.to_datetime('18:00').time():
            # if not sell_stop and not buy_stop:
            print(f"OPEN : {open_value}")
            print(counter)
            print(f"buy {a1a}")
            print(f"sell {a1b}")
            if buy_stop and not sell_stop :  
              hasil = float('{:.2f}'.format(sellstop - open_value))
              print(f"Close Jam 11 {hasil}")
              break
            elif sell_stop and not buy_stop:
              hasil = float('{:.2f}'.format(open_value - buystop))
              print(f"Close Jam 11 {hasil}")
              break
            break
              # if tp6b:
              #     print(f"buy tp6 : {a1atp5}")
              # elif tp5b:
              #     print(f"buy tp5 : {a1atp4}")
              # elif tp4b:
              #     print(f"nuy tp4 : {a1atp3}")
              # elif tp3b:
              #     print(f"buy tp3 : {a1atp2}")
              # elif tp2b:
              #     print(f"buy tp2 : {a1atp1}")
              # elif tp1b:
              #     print(f"buy tp1 : {a1atp}")
              # if tp6s:
              #     print(f"sell tp6 : {a1btp5}")
              # elif tp5s:
              #     print(f"sell tp5 : {a1btp4}")
              # elif tp4s:
              #     print(f"sell tp4 : {a1btp3}")
              # elif tp3s:
              #     print(f"sell tp3 : {a1btp2}")
              # elif tp2s:
              #     print(f"sell tp2 : {a1btp1}")
              # elif tp1s:
              #     print(f"sel tp1 : {a1btp}")
              # break


      #PROGRAM C
      elif fibo100 >= first_next >= fibo61 or fibo100 <= first_next <= fibo61:
        if UpTrend :
          selisihbep = float('{:.2f}'.format(fibo0-fibo23))
          c2a = ((fibo61+fibo100)/2)-keypip
          c2b = fibo61-keypip
          c2c = fibo100-keypip
          c2d = fibo61+keypip+sphread
          c2tp = fibo0-keypip
          c2tp1 = c2tp+trail
          c2tp2 = c2tp1+trail
          c2tp3 = c2tp2+trail
          c2tp4 = c2tp3+trail
          c2tp5 = c2tp4+trail
          c2tp6 = c2tp5+trail
          ts = float('{:.2f}'.format(tssell+keypip+sphread))
          ts1 = ts-4
          ts2 = ts1-4
          ts3 = ts2-4
          ts4 = ts3-4
          ts5 = ts4-4
          ts6 = ts5-4 
          selisihts = float('{:.2f}'.format(fibo0-c2d))
          tssell = float('{:.2f}'.format(c2c - selisihts))
          bepsell = float('{:.2f}'.format(tssell + selisihbep))                   
          if not stop_loss:              
            if (open_value <= stoploss or low_value <= stoploss or high_value <= stoploss) and buy:
              if counter < 4:
                if (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):           
                  stop_loss = True
                  print(f"TRAIL STOP : {stoploss} ")
                  sell_stop = False
                  buy_stop = False
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)
                elif index.time() >= pd.to_datetime('16:00').time():
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)  
                  print(counter)   
                  break
                elif bep and not (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):
                  stop_loss = True
                  # print(f"STOP LOSS : {stoploss}")
                  print(f"BEP AT : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  bep = False                 
                else :
                  stop_loss = True
                  print(f"STOP LOSS: {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)       
              elif (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):
                stop_loss = True
                print(f"TRAIL STOP : {stoploss}")
                hasil = float('{:.2f}'.format(stoploss - buystop))
                print(hasil) 
                print(counter)
                break           
              else:
                stop_loss = True
                print(f"STOP LOSS : {stoploss}")
                hasil = float('{:.2f}'.format(stoploss - buystop))
                print(hasil) 
                print(counter) 
                break
            elif (open_value >= stoploss or low_value >= stoploss or high_value >= stoploss) and sell:
              if counter < 4:
                if (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):                
                  stop_loss = True
                  print(f"TRAIL STOP : {stoploss} ")
                  sell_stop = False
                  buy_stop = False
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)
                elif index.time() >= pd.to_datetime('16:00').time():
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)  
                  print(counter)   
                  break
                elif bep and not (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):
                  stop_loss = True
                  # print(f"STOP LOSS : {stoploss}")
                  print(f"BEP AT : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  bep = False               
                else :
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)   
              elif (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):
                stop_loss = True
                print(f"TRAIL STOP : {stoploss}")
                hasil = float('{:.2f}'.format(sellstop - stoploss))
                print(hasil) 
                print(counter)                
              else:
                stop_loss = True
                print(f"STOP LOSS : {stoploss}")
                hasil = float('{:.2f}'.format(sellstop - stoploss))
                print(hasil) 
                print(counter)   
                break          
          if c2d >= open_value >= c2c:
            if not setopen:
              sellstop = float('{:.2f}'.format(c2c))
              print(f"SELL STOP : {sellstop}")
              sell_stop = True
              buystop = float('{:.2f}'.format(c2d))
              print(f"BUY STOP : {buystop}")
              buy_stop = True
              setopen = True
            elif setopen:
              if (open_value <= c2c or low_value <= c2c or high_value <= c2c):
                if counter >= 4:
                  buy_stop = False
                  sell_stop = False
                elif index.time() >= pd.to_datetime('16:00').time() and not (buy_stop or sell_stop):
                  sell_stop = False
                  buy_stop = False                
                elif sell_stop and not sell:
                  stop_loss = False
                  print(f"SELL STOP AT: {sellstop}")
                  sell = True
                  buy = False
                  counter = counter+1
                  buy_stop = True
                  # buystop = float('{:.2f}'.format(b2d))
                  sell_stop = False
                  stoploss = buystop
                  bep = False
                  #-----------------------------------------------------------
              elif (open_value >= c2d or low_value >= c2d or high_value >= c2d):
                if counter >= 4:
                  buy_stop = False
                  sell_stop = False
                elif index.time() >= pd.to_datetime('16:00').time() and not (buy_stop or sell_stop):
                  sell_stop = False
                  buy_stop = False                
                elif buy_stop and not buy:
                  stop_loss = False                  
                  print(f"BUY STOP AT: {buystop}")
                  sell = False
                  buy = True
                  counter = counter+1
                  sell_stop = True
                  buy_stop = False
                  stoploss = sellstop
                  bep = False
                  #----------------------------------------------------------
          if sell:
            if (open_value <= tssell or low_value <= tssell or high_value <= tssell):            
              if (open_value <= ts6 or low_value <= ts6 or high_value <= ts6):
                  tp7s = True
              elif (open_value <= ts5 or low_value <= ts5 or high_value <= ts5):
                  tp6s = True
              elif (open_value <= ts4 or low_value <= ts4 or high_value <= ts4):
                  tp5s = True
              elif (open_value <= ts3 or low_value <= ts3 or high_value <= ts3):
                  tp4s = True
              elif (open_value <= ts2 or low_value <= ts2 or high_value <= ts2):
                  tp3s = True
              elif (open_value <= ts1 or low_value <= ts1 or high_value <= ts1):
                  tp2s = True
              elif (open_value <= ts or low_value <= ts or high_value <= ts):
                  tp1s = True
              if tp7s:
                stoploss = float('{:.2f}'.format(ts5))                  
              elif tp6s:
                  stoploss = float('{:.2f}'.format(ts4))
              elif tp5s:
                  stoploss = float('{:.2f}'.format(ts3))
              elif tp4s:
                  stoploss = float('{:.2f}'.format(ts2))
              elif tp3s:
                  stoploss = float('{:.2f}'.format(ts1))
              elif tp2s:
                  stoploss = float('{:.2f}'.format(ts))
              elif tp1s:
                  stoploss = float('{:.2f}'.format(ts))
            elif (open_value <= bepsell or low_value <= bepsell or high_value <= bepsell):
              bep = True
              stoploss = float('{:.2f}'.format(sellstop))

          elif buy:
            if (open_value >= fibo0 or low_value >= fibo0 or high_value >= fibo0):            
              if (open_value >= c2tp6 or low_value >= c2tp6 or high_value >= c2tp6):
                  tp7b = True            
              elif (open_value >= c2tp5 or low_value >= c2tp5 or high_value >= c2tp5):
                  tp6b = True
              elif (open_value >= c2tp4 or low_value >= c2tp4 or high_value >= c2tp4):
                  tp5b = True
              elif (open_value >= c2tp3 or low_value >= c2tp3 or high_value >= c2tp3):
                  tp4b = True
              elif (open_value >= c2tp2 or low_value >= c2tp2 or high_value >= c2tp2):
                  tp3b = True
              elif (open_value >= c2tp1 or low_value >= c2tp1 or high_value >= c2tp1):
                  tp2b = True
              elif (open_value >= c2tp or low_value >= c2tp or high_value >= c2tp):
                  tp1b = True
              if tp7b:
                  stoploss = float('{:.2f}'.format(c2tp5))
              elif tp6b:
                  stoploss = float('{:.2f}'.format(c2tp4))
              elif tp5b:
                  stoploss = float('{:.2f}'.format(c2tp3))
              elif tp4b:
                  stoploss = float('{:.2f}'.format(c2tp2))
              elif tp3b:
                  stoploss = float('{:.2f}'.format(c2tp1))
              elif tp2b:
                  stoploss = float('{:.2f}'.format(c2tp))
              elif tp1b:
                  stoploss = float('{:.2f}'.format(c2tp))
            elif (open_value >= fibo23 or low_value >= fibo23 or high_value >= fibo23) and not bep:
              bep = True
              stoploss = float('{:.2f}'.format(buystop))                

          if index.time() >= pd.to_datetime('16:00').time() and counter == 0:
            sell_stop = False
            buy_stop = False                     
          if index.time() >= pd.to_datetime('18:00').time():
            # if not sell_stop and not buy_stop:
            print(f"OPEN : {open_value}")
            print(counter)
            print(f"buy {buystop}")
            print(f"sell {sellstop}")
            print(tp1b, tp2b, tp3b, tp4b, tp5b, tp6b)
            print(bep)
            if buy_stop and not sell_stop :  
              hasil = float('{:.2f}'.format(sellstop - open_value))
              print(f"Close Jam 11 {hasil}")
              break
            elif sell_stop and not buy_stop:
              hasil = float('{:.2f}'.format(open_value - buystop))
              print(f"Close Jam 11 {hasil}")
              break
            break   

  #--------------------------------------------------------------------------------
        elif DownTrend:
          selisihbep = float('{:.2f}'.format(fibo23-fibo0))
          c1a = ((fibo61+fibo100)/2)+keypip+sphread
          c1b = fibo61+keypip+sphread
          c1c = fibo100+keypip+sphread
          c1d = fibo61-keypip
          c1tp = fibo0+keypip+sphread
          c1tp1 = c1tp-trail
          c1tp2 = c1tp1-trail
          c1tp3 = c1tp2-trail
          c1tp4 = c1tp3-trail
          c1tp5 = c1tp4-trail
          c1tp6 = c1tp5-trail
          ts = float('{:.2f}'.format(tssell+keypip+sphread))
          ts1 = ts-4
          ts2 = ts1-4
          ts3 = ts2-4
          ts4 = ts3-4
          ts5 = ts4-4
          ts6 = ts5-4          
          selisihts = float('{:.2f}'.format(c1d-fibo0))
          tsbuy = float('{:.2f}'.format(c1c + selisihts))
          bepbuy = float('{:.2f}'.format(tsbuy-selisihbep))           
          if not stop_loss:              
            if (open_value <= stoploss or low_value <= stoploss or high_value <= stoploss) and buy:
              if counter < 4:
                if (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):           
                  stop_loss = True
                  print(f"TRAIL STOP : {stoploss} ")
                  sell_stop = False
                  buy_stop = False
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)
                elif index.time() >= pd.to_datetime('16:00').time():
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)  
                  print(counter)   
                  break
                elif bep and not (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):
                  stop_loss = True
                  # print(f"STOP LOSS : {stoploss}")
                  print(f"BEP AT : {stoploss}")
                  sell_stop = False
                  buy_stop = False 
                  bep = False                 
                else :
                  stop_loss = True
                  print(f"STOP LOSS: {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(stoploss - buystop))
                  print(hasil)       
              elif (tp1b or tp2b or tp3b or tp4b or tp5b or tp6b):
                stop_loss = True
                print(f"TRAIL STOP : {stoploss}")
                hasil = float('{:.2f}'.format(stoploss - buystop))
                print(hasil) 
                print(counter)
                break           
              else:
                stop_loss = True
                print(f"STOP LOSS : {stoploss}")
                hasil = float('{:.2f}'.format(stoploss - buystop))
                print(hasil) 
                print(counter) 
                break
            elif (open_value >= stoploss or low_value >= stoploss or high_value >= stoploss) and sell:
              if counter < 4:
                if (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):                
                  stop_loss = True
                  print(f"TRAIL STOP : {stoploss} ")
                  sell_stop = False
                  buy_stop = False
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)
                elif index.time() >= pd.to_datetime('16:00').time():
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)  
                  print(counter)   
                  break
                elif bep and not (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):
                  stop_loss = True
                  # print(f"STOP LOSS : {stoploss}")
                  print(f"BEP AT : {stoploss}")
                  sell_stop = False
                  buy_stop = False 
                  bep = False               
                else :
                  stop_loss = True
                  print(f"STOP LOSS : {stoploss}")
                  sell_stop = True
                  buy_stop = True 
                  hasil = float('{:.2f}'.format(sellstop - stoploss))
                  print(hasil)   
              elif (tp1s or tp2s or tp3s or tp4s or tp5s or tp6s):
                stop_loss = True
                print(f"TRAIL STOP : {stoploss}")
                hasil = float('{:.2f}'.format(sellstop - stoploss))
                print(hasil) 
                print(counter)                
              else:
                stop_loss = True
                print(f"STOP LOSS : {stoploss}")
                hasil = float('{:.2f}'.format(sellstop - stoploss))
                print(hasil) 
                print(counter)   
                break
          if c1d <= open_value <= c1c :
            if not setopen:
              sellstop = float('{:.2f}'.format(c1d))
              print(f"SELL STOP : {sellstop}")
              sell_stop = True
              buystop = float('{:.2f}'.format(c1c))
              print(f"BUY STOP : {buystop}")
              buy_stop = True
              setopen = True  
            elif setopen:
              if (open_value <= sellstop or low_value <= sellstop or high_value <= sellstop):
                if counter >= 4:
                  buy_stop = False
                  sell_stop = False
                elif index.time() >= pd.to_datetime('16:00').time() and not (buy_stop or sell_stop):
                  sell_stop = False
                  buy_stop = False
                elif sell_stop and not sell:
                  stop_loss = False
                  print(f"SELL STOP AT : {sellstop}")
                  sell = True
                  buy = False
                  counter = counter+1
                  buy_stop = True
                  stoploss = buystop
                  # print(f"BUY STOP : {buystop}")
                  sell_stop = False
                  bep = False
              elif (open_value >= buystop or low_value >= buystop or high_value >= buystop):
                break
                if counter >= 4:
                  buy_stop = False
                  sell_stop = False
                elif index.time() >= pd.to_datetime('16:00').time() and not (buy_stop or sell_stop):
                  sell_stop = False
                  buy_stop = False
                elif buy_stop and not buy:
                  stop_loss = False
                  print(f"BUY STOP AT : {buystop}")
                  buy = True
                  sell = False
                  counter = counter + 1
                  buy_stop = False
                  stoploss = sellstop
                  # print(f"SELL STOP : {sellstop}")
                  sell_stop = True
                  bep = False
                  
          if sell:
            if (open_value <= fibo0 or low_value <= fibo0 or high_value <= fibo0):            
              if (open_value <= c1tp6 or low_value6 <= c1tp6 or high_value <= c1tp6):
                  tp7s = True
              elif (open_value <= c1tp5 or low_value5 <= c1tp5 or high_value <= c1tp5):
                  tp6s = True
              elif (open_value <= c1tp4 or low_value4 <= c1tp4 or high_value <= c1tp4):
                  tp5s = True
              elif (open_value <= c1tp3 or low_value3 <= c1tp3 or high_value <= c1tp3):
                  tp4s = True
              elif (open_value <= c1tp2 or low_value2 <= c1tp2 or high_value <= c1tp2):
                  tp3s = True
              elif (open_value <= c1tp1 or low_value1 <= c1tp1 or high_value <= c1tp1):
                  tp2s = True
              elif (open_value <= c1tp or low_value <= c1tp or high_value <= c1tp):
                  tp1s = True
              if tp7s:
                stoploss = float('{:.2f}'.format(c1tp5))                  
              elif tp6s:
                  stoploss = float('{:.2f}'.format(c1tp4))
              elif tp5s:
                  stoploss = float('{:.2f}'.format(c1tp3))
              elif tp4s:
                  stoploss = float('{:.2f}'.format(c1tp2))
              elif tp3s:
                  stoploss = float('{:.2f}'.format(c1tp1))
              elif tp2s:
                  stoploss = float('{:.2f}'.format(c1tp))
              elif tp1s:
                  stoploss = float('{:.2f}'.format(c1tp))
            elif (open_value <= fibo23 or low_value <= fibo23 or high_value <= fibo23):
              bep = True
              stoploss = float('{:.2f}'.format(sellstop))  

          elif buy:
            if (open_value >= tsbuy or low_value >= tsbuy or high_value >= tsbuy):            
              if (open_value >= ts6 or low_value >= ts6 or high_value >= ts6):
                  tp7b = True
              elif (open_value >= ts5 or low_value >= ts5 or high_value >= ts5):
                  tp6b = True
              elif (open_value >= ts4 or low_value >= ts4 or high_value >= ts4):
                  tp5b = True
              elif (open_value >= ts3 or low_value >= ts3 or high_value >= ts3):
                  tp4b = True
              elif (open_value >= ts2 or low_value >= ts2 or high_value >= ts2):
                  tp3b = True
              elif (open_value >= ts1 or low_value >= ts1 or high_value >= ts1):
                  tp2b = True
              elif (open_value >= ts or low_value >= ts or high_value >= ts):
                  tp1b = True
              if tp7b:
                stoploss = float('{:.2f}'.format(ts5))                  
              elif tp6b:
                  stoploss = float('{:.2f}'.format(ts4))
              elif tp5b:
                  stoploss = float('{:.2f}'.format(ts3))
              elif tp4b:
                  stoploss = float('{:.2f}'.format(ts2))
              elif tp3b:
                  stoploss = float('{:.2f}'.format(ts1))
              elif tp2b:
                  stoploss = float('{:.2f}'.format(ts))
              elif tp1b:
                  stoploss = float('{:.2f}'.format(ts))
            elif (open_value >= bepbuy or low_value >= bepbuy or high_value >= bepbuy):
              bep = True
              stoploss = float('{:.2f}'.format(buystop))   

          if index.time() >= pd.to_datetime('16:00').time() and counter == 0:
            sell_stop = False
            buy_stop = False            
          if index.time() >= pd.to_datetime('18:00').time():
            # if not sell_stop and not buy_stop:
            print(f"OPEN : {open_value}")
            print(counter)
            print(f"buy {buystop}")
            print(f"sell {sellstop}")
            if buy_stop and not sell_stop :  
              hasil = float('{:.2f}'.format(sellstop - open_value))
              print(f"Close Jam 11 {hasil}")
              break
            elif sell_stop and not buy_stop:
              hasil = float('{:.2f}'.format(open_value - buystop))
              print(f"Close Jam 11 {hasil}")
              break
            break          



      #--------------------------------------------------------------#
  else:
      print("No data available for the next day.")
  plt.show()
# Check if the specified date range exists in intraday data
if start_date not in intraday.index:
    startdate = datetime.strptime(start_date, '%m-%d-%Y %H:%M')
    enddate = datetime.strptime(end_date, '%m-%d-%Y %H:%M')
    startday = startdate - timedelta(days=1)
    endday = enddate - timedelta(days=1)
    print("Specified date range not available in intraday data.")
    output_str = start_date.strftime('%m-%d-%Y %H:%M')
    print(output_str)
    if start_date not in intraday.index:
        startday = startdate - timedelta(days=2)
        endday = enddate - timedelta(days=2)
        print("Specified date range not available in intraday data.")
        output_str = start_date.strftime('%m-%d-%Y %H:%M')
        print(output_str)
        main()
    else:
        main()
else:
    main()

# -*- coding: utf-8 -*-
import eel
# import render

eel.init('./')


# try:
	# @eel.expose
	# def plot(csv, data):
		# render.Mix(csv, data)
		# return None
		
# except:
  # print('he')
  
  
  
eel.start('./index.html', block=False)
print ('started')

while True:
	eel.sleep(10)
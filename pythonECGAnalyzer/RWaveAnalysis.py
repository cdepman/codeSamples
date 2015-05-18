# see README.md for further discussion of RWaveAnalysis Class

import collections
import datetime
import isodate

class RWaveAnalysis:

  def __init__(self, attributes):
    self.notch = attributes.notch
    self.timespanShort = attributes.timespanShort
    self.timeSpanLong = attributes.timespanLong
    self.minFeatureCount = attributes.minFeatures
    self.bufferLength = attributes.bufferLength
    self.minDistance = attributes.minDistance
    self.rWaveBuffer = collections.deque()
    self.rWavePeakCandidateBuffer = []
    self.captureStream = False
    self.heartRate = '65' # default heartrate while buffer builds
    
  def analyze(self, data):
    self.findRWavePeak(data)
    # self.drawDataToSTDOUT(data) # uncomment for ASCII data graph in console
    return self.checkBuffer()

  def findRWavePeak(self, data):
    data = self.cleanData(data)
    if self.tripsRecordingThreshold(data):
      self.captureStream = True
      self.rWavePeakCandidateBuffer.append(data)
    elif self.captureStream and float(data['amplitude']) > self.notch:
      self.rWavePeakCandidateBuffer.append(data)
    elif len(self.rWavePeakCandidateBuffer):
      self.captureStream = False
      rWavePeakTime = max(self.rWavePeakCandidateBuffer, key=lambda x: float(x['amplitude']))['time']
      self.addToBuffer(rWavePeakTime)
      self.resetRWavePeakCandidateBuffer()

  def addToBuffer(self, timeStamp):
    # converts ISO 8601 string timestamp to Python Datetime Object without timezone info
    dateTimeObj = isodate.parse_datetime(timeStamp).replace(tzinfo=None)
    self.rWaveBuffer.append(dateTimeObj)
    if len(self.rWaveBuffer) > self.bufferLength:
      self.rWaveBuffer.popleft() # discard old data

  def checkBuffer(self):
    # creates list of peak RR-intervals
    peakTimeDiffs = self.getTimeDiffs()
    self.setHeartRate(peakTimeDiffs)
    # filters list of RR-intervals for abnormal length intervals specified by timespan
    significantFeatures = self.extractSignificantFeatures(peakTimeDiffs)
    if len(significantFeatures) > self.minFeatureCount:
      self.resetFeatures()
      return {'statusCode':'404', 'heartRate': self.heartRate} # code 404 indicates arrhythmia
    else:
      self.resetFeatures()
      return {'statusCode':'200', 'heartRate': self.heartRate} # code 200 indicates NSR

  def setHeartRate(self, peakTimeDiffs):
    if not peakTimeDiffs or len(peakTimeDiffs) < 5:
      self.heartRate = self.heartRate
    else:
      self.heartRate = format(60 / (reduce(lambda x, y: x + y, peakTimeDiffs) / len(peakTimeDiffs)), '.0f')

  def tripsRecordingThreshold(self, data):
    amplitude = float(data['amplitude'])
    parsedDataTime = isodate.parse_datetime(data['time'])
    lastBufferTime = self.rWaveBuffer[len(self.rWaveBuffer) - 1]
    minDistanceDelta = datetime.timedelta(0, 0, 0, self.minDistance)
    if amplitude > self.notch and not self.captureStream and parsedDataTime > (lastBufferTime + minDistanceDelta):
      return True
    return False

  def extractSignificantFeatures(self, peakTimeDiffs):
    return [peakTimeDiffs[i] for i in range(len(peakTimeDiffs)) if peakTimeDiffs[i] < self.timespanShort and peakTimeDiffs[i] > self.timespanLong]

  def getTimeDiffs(self):
    return [(self.rWaveBuffer[i+1] - self.rWaveBuffer[i]).total_seconds() for i in range(len(self.rWaveBuffer)-1)]

  def cleanData(self, data):
    # cleans data if it has abnormal amplitude buildup from race conditions on the hardware
    if len(data['amplitude']) > 5:
      data['amplitude'] = data['amplitude'][0:5]
    return data

  def resetFeatures(self):
    self.significantFeatures = 0

  def resetRWavePeakCandidateBuffer(self):
    self.rWavePeakCandidateBuffer = []

  # visualize data with ASCII console graph, adjusted by offset
  def drawDataToSTDOUT(self, data):
    offset = 90
    for idx in xrange(int(float(data['amplitude']) ** 3 - offset)): 
      print('|'),
    print('\n'),
const util = require('util')

const windlass_base_path = 'winches.windlass%d.'

module.exports = [
  {
    node: function (n2k) {
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'type'
    },
    value: function () { return 'windlass' }
  },
  {
    node: function (n2k) {
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'rodeCounter'
    },
    value: function (n2k) {
      return n2k.fields['Rode Counter Value']
    },
    filter: function (n2k) {
      return typeof n2k.fields['Rode Counter Value'] !== 'undefined'
    }
  },
  {
    node: function (n2k) {
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'lineSpeed'
    },
    value: function (n2k) {
      return n2k.fields['Windlass Line Speed']
    },
    filter: function (n2k) {
      return typeof n2k.fields['Windlass Line Speed'] !== 'undefined'
    }
  },
  {
    node: function (n2k) {
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'state'
    },
    value: function (n2k) {
      switch(n2k.fields['Windlass Motion Status'])
      {
        case 'Deployment occurring':
          return 'deploying'
        case 'Retrieval occurring':
          return 'retrieving'
        default:
          return 'stopped'
      }
    },
    filter: function (n2k) {
      return typeof n2k.fields['Windlass Motion Status'] !== 'undefined'
    }
  },
  {
    node: function (n2k) {
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'rodeType'
    },
    value: function (n2k) {
      switch(n2k.fields['Rode Type Status'])
      {
        case 'Rope presently detected':
          return 'rope'
        default:
          return 'chain'
      }
     },
    filter: function (n2k) {
      return typeof n2k.fields['Rode Type Status'] !== 'undefined'
    }
  },
/*  {
    node: function (n2k) {
      return 'windlass.' + n2k.fields['Windlass ID'] + '.anchorDockingStatus'
    },
    value: function (n2k) {
      return n2k.fields['Anchor Docking Status']
    },
    filter: function (n2k) {
      return typeof n2k.fields['Anchor Docking Status'] !== 'undefined'
    }
  } */
]

const windlass_base_message_path = 'notifications.winches.windlass%d.'

var operatingEventNotifications = [
  {
    node: windlass_base_message_path + 'systemError',
    message: 'Windlass %s system error',
    analyzerText: 'System error',
    state: 'alarm'
  },
  {
    node: windlass_base_message_path + 'sensorError',
    message: 'Windlass %s sensor error',
    analyzerText: 'Sensor error',
    state: 'alarm'
  },
  {
    node: windlass_base_message_path + 'noMotionDetected',
    message: 'Windlass %s no motion detected',
    analyzerText: 'No windlass motion detected',
    state: 'alarm'
  },
  {
    node: windlass_base_message_path + 'dockingDistanceReached',
    message: 'Windlass %s retrieval docking distance reached',
    analyzerText: 'Retrieval docking distance reached',
    state: 'alert'
  },
  {
    node: windlass_base_message_path + 'endOfRode',
    message: 'Windlass %s end of rode reached',
    analyzerText: 'End of rode reached',
    state: 'alert'
  },
]

function generateMappingsForEvents (field, notifications) {
  notifications.forEach((notif, index) => {
    var mapping = {
      node: function (n2k) {
        return util.format(notif.node, n2k.fields['Windlass ID'])
      },
      filter: function (n2k) {
        return typeof n2k.fields[field] !== 'undefined'
      },
      value: function (n2k, state) {
        if (n2k.fields[field].indexOf(notif.analyzerText) != -1) {
          return {
            state: notif.state,
            method: ['visual', 'sound'],
            message: util.format(notif.message, n2k.fields['Windlass ID'])
          }
        } else {
          return {
            state: 'normal',
            method: [],
            message:
              util.format(notif.message, n2k.fields['Windlass ID']) + ' is Normal'
          }
        }
      }
    }
    module.exports.push(mapping)
  })
}

generateMappingsForEvents ('Windlass Operating Events', operatingEventNotifications)
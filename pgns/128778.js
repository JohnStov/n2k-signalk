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
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'totalMotorTime'
    },
    value: function (n2k) {
      return n2k.fields['Total Motor Time']
        .split(':')
        .reduce((acc, time) => 60 * acc + +time)
    },
    filter: function (n2k) {
      return typeof n2k.fields['Total Motor Time'] !== 'undefined'
    }
  },
  {
    node: function (n2k) {
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'controllerVoltage'
    },
    value: function (n2k) {
      return n2k.fields['Controller voltage']
    },
    filter: function (n2k) {
      return typeof n2k.fields['Controller voltage'] !== 'undefined'
    }
  },
  {
    node: function (n2k) {
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'motorCurrent'
    },
    value: function (n2k) {
      return n2k.fields['Motor current']
    },
    filter: function (n2k) {
      return typeof n2k.fields['Motor current'] !== 'undefined'
    }
  }
]

const windlass_base_message_path = 'notifications.winches.windlass%d.'

var monitoringEventNotifications = [
  {
    node: windlass_base_message_path + 'underVoltage',
    message: 'Windlass %s controller under voltage cut-out',
    analyzerText: 'Controller under voltage cut-out'
  },
  {
    node: windlass_base_message_path + 'overCurrent',
    message: 'Windlass %s controller over current cut-out',
    analyzerText: 'Controller over current cut-out'
  },
  {
    node: windlass_base_message_path + 'overTemperature',
    message: 'Windlass %s controller over temperature cut-out',
    analyzerText: 'Controller over temperature cut-out'
  },
  {
    node: windlass_base_message_path + 'manufacturerDefined',
    message: 'Windlass %s manufacturer defined event detected',
    analyzerText: 'Manufacturer defined'
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
            state: 'alarm',
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

generateMappingsForEvents ('Windlass Monitoring Events', monitoringEventNotifications)
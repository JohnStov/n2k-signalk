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
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'control'
    },
    value: function (n2k) {
      switch(n2k.fields['Windlass Direction Control'])
      {
        case 'Down':
          return 'deploy'
        case 'Up':
          return 'retrieve'
        default:
          return 'stop'
      }
    },
    filter: function (n2k) {
      return typeof n2k.fields['Windlass Direction Control'] !== 'undefined'
    }
  },
  {
    node: function (n2k) {
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'inService'
    },
    value: function (n2k) {
      switch (n2k.fields['Power Enable'])
      {
        case 'On':
          return 'yes'
        default:
          return 'no'
      }
    },
    filter: function (n2k) {
      return typeof n2k.fields['Power Enable'] !== 'undefined'
    }
  },
/*  {
    node: function (n2k) {
      return util.format(anchor_base_path, n2k.fields['Windlass ID']) + 'dockingControl'
    },
    value: function (n2k) {
      return n2k.fields['Anchor Docking Control']
    },
    filter: function (n2k) {
      return typeof n2k.fields['Anchor Docking Control'] !== 'undefined'
    }
  },
  {
    node: function (n2k) {
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'speedControlType'
    },
    value: function (n2k) {
      return n2k.fields['Speed Control Type']
    },
    filter: function (n2k) {
      return typeof n2k.fields['Speed Control Type'] !== 'undefined'
    }
  },
  {
    node: function (n2k) {
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'speedControl'
    },
    value: function (n2k) {
      return n2k.fields['Speed Control']
    },
    filter: function (n2k) {
      return typeof n2k.fields['Speed Control'] !== 'undefined'
    }
  },
  {
    node: function (n2k) {
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'mechanicalLock'
    },
    value: function (n2k) {
      return n2k.fields['Mechanical Lock']
    },
    filter: function (n2k) {
      return typeof n2k.fields['Mechanical Lock'] !== 'undefined'
    }
  },
  {
    node: function (n2k) {
      return util.format(anchor_base_path, n2k.fields['Windlass ID']) + 'deckAndAnchorWash'
    },
    value: function (n2k) {
      return n2k.fields['Deck and Anchor Wash']
    },
    filter: function (n2k) {
      return typeof n2k.fields['Deck and Anchor Wash'] !== 'undefined'
    }
  },
  {
    node: function (n2k) {
      return util.format(anchor_base_path, n2k.fields['Windlass ID']) + 'anchorLight'
    },
    value: function (n2k) {
      return n2k.fields['Anchor Light']
    },
    filter: function (n2k) {
      return typeof n2k.fields['Anchor Light'] !== 'undefined'
    }
  },
  {
    node: function (n2k) {
      return util.format(windlass_base_path, n2k.fields['Windlass ID']) + 'commandTimeout'
    },
    value: function (n2k) {
      return new Date(
        'January 1, 2000, ' + n2k.fields['Command Timeout']
      ).getMilliseconds()
    },
    filter: function (n2k) {
      return typeof n2k.fields['Command Timeout'] !== 'undefined'
    }
  } */
]

const windlass_base_message_path = 'notifications.winches.windlass%d.'

var controlEventNotifications = [
  {
    node: windlass_base_message_path + 'anotherDeviceControllingWindlass',
    message: 'Another device controlling windlass %d',
    analyzerText: 'Another device controlling windlass'
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

generateMappingsForEvents ('Windlass Control Events', controlEventNotifications)

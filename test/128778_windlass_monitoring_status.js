var chai = require('chai')
chai.Should()
chai.use(require('chai-things'))
chai.use(require('@signalk/signalk-schema').chaiModule)

describe('128778 Windlass Monitoring Status', function () {
  it('full windlass monitoring sentence converts', function () {
    var tree = require('./testMapper').toNested(
      JSON.parse(
        '{"prio":2,"pgn":128778,"dst":255,"src":36,"timestamp":"2011-11-24-22:42:04.440","fields":{"SID":170,"Windlass ID":0,"Total Motor Time":"00:03:00","Controller voltage":12,"Motor current":15,"Windlass Monitoring Events":[]}}'
      )
    )
    tree.should.have.with.nested.property(
      'winches.windlass0.type.value',
      'windlass'
    )
  tree.should.have.with.nested.property(
      'winches.windlass0.totalMotorTime.value',
      180
    )
    tree.should.have.with.nested.property(
      'winches.windlass0.controllerVoltage.value',
      12
    )
    tree.should.have.with.nested.property('winches.windlass0.motorCurrent.value', 15)
  }),
    it('minimal windlass monitoring sentence converts', function () {
      var tree = require('./testMapper').toNested(
        JSON.parse(
          '{"prio":2,"pgn":128778,"dst":255,"src":36,"timestamp":"2011-11-24-22:42:04.440","fields":{"SID":170,"Windlass ID":0,"Total Motor Time":"00:04:00"}}'
        )
      )
      tree.should.have.with.nested.property(
        'winches.windlass0.type.value',
        'windlass'
      )
      tree.should.have.with.nested.property(
        'winches.windlass0.totalMotorTime.value',
        240
      )
      tree.should.not.have.with.nested.property(
        'winches.windlass0.controllerVoltage.value'
      )
      tree.should.not.have.with.nested.property('windlass.0.motorCurrent.value')
    }),
    it('minimal windlass monitoring sentence with events converts', function () {
      var tree = require('./testMapper').toNested(
        JSON.parse(
          '{"prio":2,"pgn":128778,"dst":255,"src":36,"timestamp":"2011-11-24-22:42:04.440","fields":{"SID":170,"Windlass ID":0,"Total Motor Time":"00:04:00","Windlass Monitoring Events":["Controller under voltage cut-out","Controller over current cut-out","Controller over temperature cut-out","Manufacturer defined"]}}'
        )
      )
      tree.should.have.nested.property(
        'notifications.winches.windlass0.underVoltage.value.state',
        'alarm'
      )
      tree.should.have.nested.property(
        'notifications.winches.windlass0.overCurrent.value.state',
        'alarm'
      )
      tree.should.have.nested.property(
        'notifications.winches.windlass0.overTemperature.value.state',
        'alarm'
      )
      tree.should.have.nested.property(
        'notifications.winches.windlass0.manufacturerDefined.value.state',
        'alarm'
      )
    })
})

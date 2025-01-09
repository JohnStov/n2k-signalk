var chai = require('chai')
chai.Should()
chai.use(require('chai-things'))
chai.use(require('@signalk/signalk-schema').chaiModule)

describe('128777 Windlass Operating Status', function () {
  it('full windlass operating sentence converts', function () {
    var tree = require('./testMapper').toNested(
      JSON.parse(
        '{"prio":2,"pgn":128777,"dst":255,"src":36,"timestamp":"2011-11-24-22:42:04.440","fields":{"SID":170,"Windlass ID":0,"Windlass Motion Status":0,"Rode Type Status":0,"Rode Counter Value":15.3,"Windlass Line Speed":0,"Anchor Docking Status":0,"Windlass Operating Events":[]}}'
      )
    )
    tree.should.have.with.nested.property(
      'winches.windlass0.type.value',
      'windlass'
    )
    tree.should.have.with.nested.property(
      'winches.windlass0.state.value',
      'stopped'
    )
    tree.should.have.with.nested.property(
      'winches.windlass0.rodeType.value',
      'chain'
    )
    tree.should.have.with.nested.property('winches.windlass0.rodeCounter.value', 15.3)
    tree.should.have.with.nested.property('winches.windlass0.lineSpeed.value', 0)
  }),
    it('minimal windlass operating sentence converts', function () {
      var tree = require('./testMapper').toNested(
        JSON.parse(
          '{"prio":2,"pgn":128777,"dst":255,"src":36,"timestamp":"2011-11-24-22:42:04.440","fields":{"SID":170,"Windlass ID":0,"Rode Counter Value":15.3}}'
        )
      )
      tree.should.have.with.nested.property(
        'winches.windlass0.type.value',
        'windlass'
      )
      tree.should.not.have.with.nested.property('winches.windlass0.motionStatus.value')
      tree.should.not.have.with.nested.property('winches.windlass0.rodeType.value')
      tree.should.have.with.nested.property(
        'winches.windlass0.rodeCounter.value',
        15.3
      )
      tree.should.not.have.with.nested.property('winches.windlass0.lineSpeed.value')
    }),
    it('minimal windlass operating sentence with events converts', function () {
      var tree = require('./testMapper').toNested(
        JSON.parse(
          '{"prio":2,"pgn":128777,"dst":255,"src":36,"timestamp":"2011-11-24-22:42:04.440","fields":{"SID":170,"Windlass ID":0,"Rode Counter Value":15.3,"Windlass Operating Events":["System error","Sensor error","No windlass motion detected","Retrieval docking distance reached","End of rode reached"]}}'
        )
      )
      tree.should.have.nested.property(
        'notifications.winches.windlass0.systemError.value.state',
        'alarm'
      )
      tree.should.have.nested.property(
        'notifications.winches.windlass0.sensorError.value.state',
        'alarm'
      )
      tree.should.have.nested.property(
        'notifications.winches.windlass0.noMotionDetected.value.state',
        'alarm'
      )
      tree.should.have.nested.property(
        'notifications.winches.windlass0.dockingDistanceReached.value.state',
        'alert'
      )
      tree.should.have.nested.property(
        'notifications.winches.windlass0.endOfRode.value.state',
        'alert'
      )
    })
})

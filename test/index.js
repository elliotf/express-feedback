var chai     = require('chai')
  , should   = chai.should()
  , sinon    = require('sinon')
  , feedback = require('../index.js')
;

chai.Assertion.includeStack = true;

function fakeRes() {
  return {
    locals: {}
  }
}

describe("express-feedback", function() {
  beforeEach(function() {
    this.next = sinon.spy();
    this.req  = {};
    this.res  = fakeRes();
  });

  describe("export variable", function() {
    it("is a function", function() {
      feedback.should.be.a('function');
    });

    it("takes three arguments", function() {
      feedback.length.should.equal(3);
    });

    describe("when the request *does not* have a .locals", function() {
      it("does nothing", function() {
        this.res = {};
        feedback(this.req, this.res, this.next);

        should.not.exist(this.res.locals);
        should.not.exist(this.res.message);
        this.next.called.should.be.true;
      });
    });

    describe("when the res.message already exists", function() {
      it("does not alter it", function() {
        var res = this.res;
        res.message = 6;

        feedback(this.req, res, this.next);
        this.next.called.should.be.true;
        res.message.should.equal(6);
      });
    });
  });

  describe("usage", function() {
    beforeEach(function() {
      feedback(this.req, this.res, this.next);
    });

    describe("res.message", function() {
      it("adds a message of the given type", function() {
        this.res.message('info', 'in ur tests makin infos');
        this.res.locals.messages.length.should.equal(1);
        var msg = this.res.locals.messages[0];
        should.exist(msg.type);
        msg.type.should.equal('info');
        should.exist(msg.text);
        msg.text.should.equal('in ur tests makin infos');
      });
    });

    describe("helpers", function() {
      describe("res.message.error", function() {
        it("adds a warning message", function() {
          this.res.message.error('omg no catz!');
          this.res.locals.messages.length.should.equal(1);
          this.res.locals.messages[0].type.should.equal('error');
          this.res.locals.messages[0].text.should.equal('omg no catz!');
        });

        it("has a shortcut of .err", function() {
          this.res.message.err('omg no catz!');
          this.res.locals.messages.length.should.equal(1);
          this.res.locals.messages[0].type.should.equal('error');
          this.res.locals.messages[0].text.should.equal('omg no catz!');
        });
      });

      describe("res.message.warning", function() {
        it("adds a warning message", function() {
          this.res.message.warning('ther mite b catz');
          this.res.locals.messages.length.should.equal(1);
          this.res.locals.messages[0].type.should.equal('warning');
          this.res.locals.messages[0].text.should.equal('ther mite b catz');
        });

        it("has a shortcut of .warn", function() {
          this.res.message.warn('ther mite b catz');
          this.res.locals.messages.length.should.equal(1);
          this.res.locals.messages[0].type.should.equal('warning');
          this.res.locals.messages[0].text.should.equal('ther mite b catz');
        });
      });

      describe("res.message.info", function() {
        it("adds an info message", function() {
          this.res.message.info('ther r catz');
          this.res.locals.messages.length.should.equal(1);
          this.res.locals.messages[0].type.should.equal('info');
          this.res.locals.messages[0].text.should.equal('ther r catz');
        });
      });

      describe("res.message.success", function() {
        it("adds an info message", function() {
          this.res.message.success('u haf catz');
          this.res.locals.messages.length.should.equal(1);
          this.res.locals.messages[0].type.should.equal('success');
          this.res.locals.messages[0].text.should.equal('u haf catz');
        });

        it("has a shortcut of .win", function() {
          this.res.message.win('u haf catz');
          this.res.locals.messages.length.should.equal(1);
          this.res.locals.messages[0].type.should.equal('success');
          this.res.locals.messages[0].text.should.equal('u haf catz');
        });
      });
    });
  });
});

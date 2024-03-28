'use strict';

const common = require('ep_etherpad-lite/tests/backend/common');
const randomString = require('ep_etherpad-lite/static/js/pad_utils').randomString;
import {generateJWTToken} from "ep_etherpad-lite/tests/backend/common";

let agent;
const apiVersion = 1;

const buildHTML = (body: string) => `<html><body>${body}</body></html>`;
const getHTMLEndPointFor = (padID: string) => `/api/${apiVersion}/getHTML?padID=${padID}`;

// Creates a pad and returns the pad id. Calls the callback when finished.
const createPad = async (padID: string) => {
    const token = await generateJWTToken();
    return new Promise((resolve, reject) => {
        agent.get(`/api/${apiVersion}/createPad?padID=${padID}`)
            .set("Authorization", token)
            .end((err, res) => {
                if (err || (res.body.code !== 0)) {
                    reject(new Error('Unable to create new Pad'));
                } else {
                    resolve(padID);
                }
            });
    });
};
const setHTML = async (padID: string, html: string) => {
    const token = await generateJWTToken();
    return await new Promise((resolve, reject) => {
        agent.get(`/api/${apiVersion}/setHTML?padID=${padID}&html=${html}`)
            .set("Authorization", token)
            .end((err, res) => {
                if (err || (res.body.code !== 0)) {
                    reject(new Error('Unable to set pad HTML'));
                } else {
                    resolve(padID);
                }
            });
    });
};

describe('export Subscript to HTML', function () {
  let padID: string;
  let html: Function;

  before(async function () { agent = await common.init(); });

  // create a new pad before each test run
    beforeEach(async function () {
        padID = randomString(5);
        await createPad(padID);
        await setHTML(padID, html());
    });

  context('when pad text has one Subscript', function () {
    before(function () {
      html = () => buildHTML('<sub>Hello world</sub>');
    });

      it('returns ok', async function () {
          await agent.get(getHTMLEndPointFor(padID))
              .set("Authorization", await generateJWTToken())
              .expect('Content-Type', /json/)
              .expect(200);
      });

      it('returns HTML with Subscript HTML tags', async function () {
          const res = await agent.get(getHTMLEndPointFor(padID))
              .set("Authorization", await generateJWTToken());

          const html = res.body.data.html;
          if (html.indexOf('<sub>Hello world</sub>') === -1) {
              throw new Error('No sub tag detected');
          }
      });
  });

  context('when pad text has multiple Subscripts on multiple lines', function () {
    before(async function () {
      html = () => buildHTML('<sub>Hello world</sub><br/><sub>Foo</sub>');
    });


      it('returns ok', async function () {
          await agent.get(getHTMLEndPointFor(padID))
              .set("Authorization", await generateJWTToken())
              .expect('Content-Type', /json/)
              .expect(200);
      });

      it('returns HTML with Multiple Subscripts HTML tags', async function () {
          const res = await agent.get(getHTMLEndPointFor(padID))
              .set("Authorization", await generateJWTToken());

          const html = res.body.data.html;
          if (html.indexOf('<sub>Hello world</sub>') === -1) {
              throw new Error('No sub tag detected');
          }
          if (html.indexOf('<sub>Foo</sub>') === -1) {
              throw new Error('No sub tag detected');
          }
      });
  });
});

describe('export Superscript to HTML', function () {
  let padID;
  let html;

  // create a new pad before each test run
  beforeEach(async function () {
      padID = randomString(5);
      await createPad(padID)
      await setHTML(padID, html());
  });

  context('when pad text has one Superscript', function () {
    before(function (done) {
      html = () => buildHTML('<sup>Hello world</sup>');
      done();
    });


    it('returns ok', async function () {
       await agent.get(getHTMLEndPointFor(padID))
            .set("Authorization", await generateJWTToken())
            .expect('Content-Type', /json/)
            .expect(200);
    });

      it('returns HTML with Superscript HTML tags', async function () {
          const res = await agent.get(getHTMLEndPointFor(padID))
              .set("Authorization", await generateJWTToken());

          const html = res.body.data.html;
          if (html.indexOf('<sup>Hello world</sup>') === -1) {
              throw new Error('No sup tag detected');
          }
      });
  });

  context('when pad text has multiple Superscripts on multiple lines', function () {
    before(async function () {
      html = () => buildHTML('<sup>Hello world</sup><br/><sup>Foo</sup>');
    });

      it('returns ok', async function () {
          return await agent.get(getHTMLEndPointFor(padID))
              .set("Authorization", await generateJWTToken())
              .expect('Content-Type', /json/)
              .expect(200);
      });

      it('returns HTML with Multiple Superscripts HTML tags', async function () {
          const res = await agent.get(getHTMLEndPointFor(padID))
              .set("Authorization", await generateJWTToken());

          const html = res.body.data.html;
          if (html.indexOf('<sup>Hello world</sup>') === -1) {
              throw new Error('No sup tag detected');
          }
          if (html.indexOf('<sup>Foo</sup>') === -1) {
              throw new Error('No sup tag detected');
          }
      });
  });
});

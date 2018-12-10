import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import chaiHttp = require("chai-http");
import { suite, test } from "mocha-typescript";
const paragraph: any = require("../../paragraphs/para");

// starting the server
// tslint:disable-next-line:no-unused-expression
chai.use(chaiAsPromised);
chai.use(chaiHttp);

@suite("Para test Class")
class Paratest {

  @test("Mandatory Test")
  public mandatory(done) {
    setTimeout(() => {
      const god = "messi" + "ronaldo";
      chai.expect(god).to.deep.equal("messironaldo");
    }, 1000);
    done();
  }

  @test("Paragraph Test -- Check if same Para exist or not")
  public checkSamePara(done) {
    setTimeout(() => {
      const valueArr = paragraph.map(function(item) { return item.para; });
      const isDuplicate = valueArr.some(function(item, idx) {
        return valueArr.indexOf(item) !== idx;
      });
      if (isDuplicate === true) {
        throw new Error("Please check paragraphs you added. It seems that atleast one of them is already present in para.json file");
      }
      chai.expect(isDuplicate).to.deep.equal(false);
    }, 1000);
    done();
  }

  //
  // @test("Paragraph Test -- Remove same para")
  // public removeSamePara(done) {
  //  setTimeout(() => {
  //    var repeats = []
  // var item
  // var i = 0

  // while (i < paragraph.length) {
  //  repeats.indexOf(item = paragraph[i++].para) > -1 ? paragraph.pop(i--) : repeats.push(item)
  //  }
  //  let newPara = JSON.stringify(paragraph, null, ' ')
  //  fs.writeFile('./paragraphs/para.json', newPara, (err) => {
  //  console.log('done')
  //  });
  // }, 1000);
  // }
}

/**
 * This example program is an exact recreation of the example1.cpp found in the LTKCPP project
 */
const { LLRPClient, LLRPCore } = require("llrpjs");

/** LLRPClient */

const rOSpec = new LLRPCore.ROSpec({
  "data": {
    "ROSpecID": 1,
    "Priority": 0,
    "CurrentState": "Disabled",
    "ROBoundarySpec": {
      "ROSpecStartTrigger": {
        "ROSpecStartTriggerType": "Immediate",
      },
      "ROSpecStopTrigger": {
        "ROSpecStopTriggerType": "Null",
        "DurationTriggerValue": 0,
      },
    },
    "AISpec": {
      "AntennaIDs": [
        1,
        2,
        3,
        4,
      ],
      "AISpecStopTrigger": {
        "AISpecStopTriggerType": "Null",
        "DurationTrigger": 0,
      },
      "InventoryParameterSpec": {
        "InventoryParameterSpecID": 1,
        "AntennaConfiguration": [
          {
            "AntennaID": 1,
            "RFTransmitter": {
              "HopTableID": 0,
              "ChannelIndex": 0,
              "TransmitPower": 27,
            },
            "C1G2InventoryCommand": {
              "TagInventoryStateAware": false,
              "C1G2RFControl": {
                "ModeIndex": 0,
                "Tari": 0,
              },
              "C1G2SingulationControl": {
                "Session": 0,
                "TagPopulation": 0,
                "TagTransitTime": 0,
              },
            },
          },
          {
            "AntennaID": 2,
            "RFTransmitter": {
              "HopTableID": 0,
              "ChannelIndex": 0,
              "TransmitPower": 27,
            },
            "C1G2InventoryCommand": {
              "TagInventoryStateAware": false,
              "C1G2RFControl": {
                "ModeIndex": 0,
                "Tari": 0,
              },
              "C1G2SingulationControl": {
                "Session": 0,
                "TagPopulation": 0,
                "TagTransitTime": 0,
              },
            },
          },
          {
            "AntennaID": 3,
            "RFTransmitter": {
              "HopTableID": 0,
              "ChannelIndex": 0,
              "TransmitPower": 27,
            },
            "C1G2InventoryCommand": {
              "TagInventoryStateAware": false,
              "C1G2RFControl": {
                "ModeIndex": 0,
                "Tari": 0,
              },
              "C1G2SingulationControl": {
                "Session": 0,
                "TagPopulation": 0,
                "TagTransitTime": 0,
              },
            },
          },
          {
            "AntennaID": 4,
            "RFTransmitter": {
              "HopTableID": 0,
              "ChannelIndex": 0,
              "TransmitPower": 27,
            },
            "C1G2InventoryCommand": {
              "TagInventoryStateAware": false,
              "C1G2RFControl": {
                "ModeIndex": 0,
                "Tari": 0,
              },
              "C1G2SingulationControl": {
                "Session": 0,
                "TagPopulation": 0,
                "TagTransitTime": 0,
              },
            },
          },
        ],
        "ProtocolID": "EPCGlobalClass1Gen2",
      },
    },
    "ROReportSpec": {
      "ROReportTrigger": "Upon_N_Tags_Or_End_Of_AISpec",
      "N": 1,
      "TagReportContentSelector": {
        "EnableROSpecID": false,
        "EnableSpecIndex": false,
        "EnableInventoryParameterSpecID": false,
        "EnableAntennaID": false,
        "EnableChannelIndex": false,
        "EnablePeakRSSI": false,
        "EnableFirstSeenTimestamp": true,
        "EnableLastSeenTimestamp": true,
        "EnableTagSeenCount": false,
        "EnableAccessSpecID": false,
      },
    },
  },
});

class Main {
  reader = null;

  constructor(reader) {
    this.reader = reader;

    reader.on("connect", () => console.log("connected"));
    reader.on("disconnect", () => {
      process.exit();
      console.log("disconnected");
    });
    reader.on("error", (err) => {
      process.exit();
    });

    reader.on("KEEPALIVE", () => {
      reader.send(new LLRPCore.KEEPALIVE_ACK());
    });
  }

  async checkConnectionStatus() {
    /** wait for a READER_EVENT_NOTIFICATION message */
    let msg = await this.reader.recv(10000);
    if (!(msg instanceof LLRPCore.READER_EVENT_NOTIFICATION)) {
      throw new Error(`connection status check failed -1`);
    }
    const status = msg.getReaderEventNotificationData()
      .getConnectionAttemptEvent()?.getStatus();
    if (status != "Success") {
      throw new Error(`connection status check failed ${status}`);
    }
    console.log(`Connection status ${status}`);
    return;
  }

  async scrubConfiguration() {
    let rsp = await this.deleteAllROSpecs();
    if (rsp instanceof LLRPCore.DELETE_ROSPEC_RESPONSE) {
      console.log(`Delete all ROSpecs ${rsp.getLLRPStatus().getStatusCode()}`);
    }
    rsp = await this.resetToFactoryDefaults();
    if (rsp instanceof LLRPCore.SET_READER_CONFIG_RESPONSE) {
      console.log(
        `Reset to factory defaults ${rsp.getLLRPStatus().getStatusCode()}`,
      );
    }
  }

  async addROSpec() {
    const rsp = await this.reader.transact(
      new LLRPCore.ADD_ROSPEC().setROSpec(rOSpec),
    );
    if (rsp instanceof LLRPCore.ADD_ROSPEC_RESPONSE) {
      console.log(`Add ROSpec ${rsp.getLLRPStatus().getStatusCode()}`);
    }
  }

  async enableROSpec() {
    const rsp = await this.reader.transact(
      new LLRPCore.ENABLE_ROSPEC({
        data: {
          ROSpecID: rOSpec.getROSpecID(),
        },
      }),
    );
    if (rsp instanceof LLRPCore.ENABLE_ROSPEC_RESPONSE) {
      console.log(`Enable ROSpec ${rsp.getLLRPStatus().getStatusCode()}`);
    }
  }

  async startROSpec() {
    const rsp = await this.reader.transact(
      new LLRPCore.START_ROSPEC({
        data: {
          ROSpecID: rOSpec.getROSpecID(),
        },
      }),
    );
    if (rsp instanceof LLRPCore.START_ROSPEC_RESPONSE) {
      console.log(`Start ROSpec ${rsp.getLLRPStatus().getStatusCode()}`);
    }
  }

  deleteAllROSpecs() {
    return this.reader.transact(
      new LLRPCore.DELETE_ROSPEC({
        data: {
          ROSpecID: 0, // all
        },
      }),
    );
  }

  resetToFactoryDefaults() {
    return this.reader.transact(
      new LLRPCore.SET_READER_CONFIG({
        data: {
          ResetToFactoryDefault: true,
        },
      }),
    );
  }

  async awaitAndPrintReport() {
    let msg = null;
    try {
      while (msg = await this.reader.recv(10000)) {
        if (msg instanceof LLRPCore.RO_ACCESS_REPORT) {
          let tagReportDataList = msg.getTagReportData();
          if (!Array.isArray(tagReportDataList)) {
            tagReportDataList = [tagReportDataList];
          }
          for (let tagReportData of tagReportDataList) {
            const firstSeen =
              tagReportData.getFirstSeenTimestampUTC()?.getMicroseconds()
                .toString() ?? "unknown";
            const lastSeen =
              tagReportData.getLastSeenTimestampUTC()?.getMicroseconds()
                .toString() ?? "unknown";
            let epc = tagReportData.getEPCParameter();
            console.log(
              `EPC: ${epc.getEPC()}`,
            );
          }
        }
      }
    } catch (e) {
      this.reader?.disconnect();
      process.exit();
    }
  }

  async run() {
    // wait for server to initialize
    try {
      /** start */
      console.log("connecting ...");
      await this.reader.connect();
      /** connected */
      await this.checkConnectionStatus();
      /** received LLRP notification. Do factory reset */
      await this.scrubConfiguration();
      /** add ROSpec */
      await this.addROSpec();
      /** enable and start the added ROSpec */
      await this.enableROSpec();
      await this.startROSpec();

      /** print tags */
      await this.awaitAndPrintReport();

      /** cleanup */
      await this.scrubConfiguration();
    } catch (err) {
      console.error(err);
    }

    this.reader?.disconnect();
    process.exit();
  }
}

/** Main */

const main = new Main(
  new LLRPClient({
    host: process.argv[2],
    port: process.argv[3] || 5084,
  }),
);

main.run();

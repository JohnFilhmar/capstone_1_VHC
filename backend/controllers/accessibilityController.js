const dbModel = require("../models/database_model");
const jwt = require("jsonwebtoken");

class Controller {
  async getAccessibilities(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const authHeader = req.headers["authorization"];
      const accessToken = authHeader.split(" ")[1];
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const getAccessibilities = await dbModel.query(
        `
        SELECT
          aaccounts.access,
          aaccounts.add_account
        FROM
          access_accounts aaccounts
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = aaccounts.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        decoded.user_id
      );
      if (getAccessibilities.length === 0) {
        const accessibility_id = await dbModel.query(
          `INSERT INTO medicalstaff_accessbility (staff_id) VALUES (?);`,
          decoded.user_id
        );
        const access_id = accessibility_id.insertId;
        const queries = [
          `INSERT INTO access_announcements (accessibility_id, access_announcements, add_announcements, delete_announcements)
           VALUES (?, 1, 0, 0);`,
          `INSERT INTO access_appointments (accessibility_id, access, view, add_appointment, options)
           VALUES (?, 1, 1, 1, 1);`,
          `INSERT INTO access_queues (accessibility_id, access, add_queue, view_attended, next, dismiss)
           VALUES (?, 1, 1, 1, 1, 1);`,
          `INSERT INTO access_records (accessibility_id, access, import, add_record, search, options)
           VALUES (?, 1, 1, 1, 1, 1);`,
          `INSERT INTO access_historical_data (accessibility_id, access, options, export)
           VALUES (?, 1, 0, 0);`,
          `INSERT INTO access_blood (accessibility_id, access, import, add_donate, search, options)
           VALUES (?, 1, 1, 1, 1, 1);`,
          `INSERT INTO access_equipments (accessibility_id, access, import, add_equipment, search, options)
           VALUES (?, 1, 1, 1, 1, 1);`,
          `INSERT INTO access_pharmacy (accessibility_id, access, import, add_product, search, options)
           VALUES (?, 1, 1, 1, 1, 1);`,
          `INSERT INTO access_accounts (accessibility_id, access, import, add_account, search, options)
           VALUES (?, 0, 0, 0, 0, 0);`,
        ];
        for (const query of queries) {
          await dbModel.query(query, [access_id]);
        }
      }

      const [accessAccounts] = await dbModel.query(
        `
        SELECT
          aaccounts.access,
          aaccounts.add_account
        FROM
          access_accounts aaccounts
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = aaccounts.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [decoded.user_id]
      );
      const [accessAnnouncements] = await dbModel.query(
        `
        SELECT
          aannouncements.access_announcements,
          aannouncements.add_announcements,
          aannouncements.delete_announcements
        FROM
          access_announcements aannouncements
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = aannouncements.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [decoded.user_id]
      );
      const [accessAppointments] = await dbModel.query(
        `
        SELECT
          aapp.access,
          aapp.view,
          aapp.add_appointment,
          aapp.options
        FROM
          access_appointments aapp
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = aapp.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [decoded.user_id]
      );
      const [accessQueues] = await dbModel.query(
        `
        SELECT
          aqueue.access,
          aqueue.add_queue,
          aqueue.view_attended,
          aqueue.next,
          aqueue.dismiss
        FROM
          access_queues aqueue
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = aqueue.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [decoded.user_id]
      );
      const [accessRecords] = await dbModel.query(
        `
        SELECT
          arecords.access,
          arecords.import,
          arecords.add_record,
          arecords.search,
          arecords.options
        FROM
          access_records arecords
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = arecords.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [decoded.user_id]
      );
      const [accessHistoricalData] = await dbModel.query(
        `
        SELECT
          ahistory.access,
          ahistory.export,
          ahistory.options
        FROM
          access_historical_data ahistory
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = ahistory.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [decoded.user_id]
      );
      const [accessBlood] = await dbModel.query(
        `
        SELECT
          ablood.access,
          ablood.import,
          ablood.add_donate,
          ablood.search,
          ablood.options
        FROM
          access_blood ablood
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = ablood.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [decoded.user_id]
      );
      const [accessEquipments] = await dbModel.query(
        `
        SELECT
          aequipments.access,
          aequipments.import,
          aequipments.add_equipment,
          aequipments.search,
          aequipments.options
        FROM
          access_equipments aequipments
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = aequipments.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [decoded.user_id]
      );
      const [accessPharmacy] = await dbModel.query(
        `
        SELECT
          apharmacy.access,
          apharmacy.import,
          apharmacy.add_product,
          apharmacy.search,
          apharmacy.options
        FROM
          access_pharmacy apharmacy
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = apharmacy.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [decoded.user_id]
      );

      return res.status(200).json({
        status: 200,
        accessibilities: {
          access_accounts: accessAccounts,
          access_announcements: accessAnnouncements,
          access_appointments: accessAppointments,
          access_blood: accessBlood,
          access_equipments: accessEquipments,
          access_historical_data: accessHistoricalData,
          access_pharmacy: accessPharmacy,
          access_queues: accessQueues,
          access_records: accessRecords,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }
  async searchAccessibilities(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const user_id = req.params.id;
      const [getAccessibilities] = await dbModel.query(
        `
        SELECT
          aqueues.access,
          medstaff.isVerified
        FROM
          access_queues aqueues
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = aqueues.accessibility_id
        INNER JOIN
          medicalstaff medstaff
        ON 
          medaccess.staff_id = medstaff.staff_id
        WHERE
          medaccess.staff_id = ?`,
        user_id
      );
      if (getAccessibilities === undefined && getAccessibilities?.isVerified) {
        const accessibility_id = await dbModel.query(
          `INSERT INTO medicalstaff_accessbility (staff_id) VALUES (?);`,
          user_id
        );
        const access_id = accessibility_id.insertId;
        const queries = [
          `INSERT INTO access_announcements (accessibility_id, access_announcements, add_announcements, delete_announcements)
           VALUES (?, 1, 0, 0);`,
          `INSERT INTO access_appointments (accessibility_id, access, view, add_appointment, options)
           VALUES (?, 1, 1, 1, 1);`,
          `INSERT INTO access_queues (accessibility_id, access, add_queue, view_attended, next, dismiss)
           VALUES (?, 1, 1, 1, 1, 1);`,
          `INSERT INTO access_records (accessibility_id, access, import, add_record, search, options)
           VALUES (?, 1, 1, 1, 1, 1);`,
          `INSERT INTO access_historical_data (accessibility_id, access, options, export)
           VALUES (?, 1, 0, 0);`,
          `INSERT INTO access_blood (accessibility_id, access, import, add_donate, search, options)
           VALUES (?, 1, 1, 1, 1, 1);`,
          `INSERT INTO access_equipments (accessibility_id, access, import, add_equipment, search, options)
           VALUES (?, 1, 1, 1, 1, 1);`,
          `INSERT INTO access_pharmacy (accessibility_id, access, import, add_product, search, options)
           VALUES (?, 1, 1, 1, 1, 1);`,
          `INSERT INTO access_accounts (accessibility_id, access, import, add_account, search, options)
           VALUES (?, 0, 0, 0, 0, 0);`,
        ];
        for (const query of queries) {
          await dbModel.query(query, [access_id]);
        }
      }

      const [accessAccounts] = await dbModel.query(
        `
        SELECT
          aaccounts.access,
          aaccounts.add_account
        FROM
          access_accounts aaccounts
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = aaccounts.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [user_id]
      );
      const [accessAnnouncements] = await dbModel.query(
        `
        SELECT
          aannouncements.access_announcements,
          aannouncements.add_announcements,
          aannouncements.delete_announcements
        FROM
          access_announcements aannouncements
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = aannouncements.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [user_id]
      );
      const [accessAppointments] = await dbModel.query(
        `
        SELECT
          aapp.access,
          aapp.view,
          aapp.add_appointment,
          aapp.options
        FROM
          access_appointments aapp
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = aapp.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [user_id]
      );
      const [accessQueues] = await dbModel.query(
        `
        SELECT
          aqueue.access,
          aqueue.add_queue,
          aqueue.view_attended,
          aqueue.next,
          aqueue.dismiss
        FROM
          access_queues aqueue
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = aqueue.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [user_id]
      );
      const [accessRecords] = await dbModel.query(
        `
        SELECT
          arecords.access,
          arecords.import,
          arecords.add_record,
          arecords.search,
          arecords.options
        FROM
          access_records arecords
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = arecords.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [user_id]
      );
      const [accessHistoricalData] = await dbModel.query(
        `
        SELECT
          ahistory.access,
          ahistory.export,
          ahistory.options
        FROM
          access_historical_data ahistory
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = ahistory.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [user_id]
      );
      const [accessBlood] = await dbModel.query(
        `
        SELECT
          ablood.access,
          ablood.import,
          ablood.add_donate,
          ablood.search,
          ablood.options
        FROM
          access_blood ablood
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = ablood.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [user_id]
      );
      const [accessEquipments] = await dbModel.query(
        `
        SELECT
          aequipments.access,
          aequipments.import,
          aequipments.add_equipment,
          aequipments.search,
          aequipments.options
        FROM
          access_equipments aequipments
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = aequipments.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [user_id]
      );
      const [accessPharmacy] = await dbModel.query(
        `
        SELECT
          apharmacy.access,
          apharmacy.import,
          apharmacy.add_product,
          apharmacy.search,
          apharmacy.options
        FROM
          access_pharmacy apharmacy
        INNER JOIN
          medicalstaff_accessbility medaccess
        ON 
          medaccess.accessibility_id = apharmacy.accessibility_id
        WHERE
          medaccess.staff_id = ?`,
        [user_id]
      );

      return res.status(200).json({
        status: 200,
        accessibilities: {
          access_accounts: accessAccounts,
          access_announcements: accessAnnouncements,
          access_appointments: accessAppointments,
          access_blood: accessBlood,
          access_equipments: accessEquipments,
          access_historical_data: accessHistoricalData,
          access_pharmacy: accessPharmacy,
          access_queues: accessQueues,
          access_records: accessRecords,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }
  async updateAccessibilities(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const authHeader = req.headers["authorization"];
      const accessToken = authHeader.split(" ")[1];
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const user_id = req.params.id;
      const { payload } = req.body;

      const [accessibility] = await dbModel.query(
        `SELECT accessibility_id FROM medicalstaff_accessbility WHERE staff_id = ?`,
        [user_id]
      );

      if (!accessibility) {
        return res.status(404).json({
          status: 404,
          message: "User accessibility not found.",
        });
      }

      const accessibility_id = accessibility.accessibility_id;

      const updateQueries = [];

      for (const table in payload) {
        const columns = payload[table];
        const setClause = Object.entries(columns)
          .map(([column, value]) => `${column} = ${value ? 1 : 0}`)
          .join(", ");
        updateQueries.push(
          `UPDATE ${table} SET ${setClause} WHERE accessibility_id = ${accessibility_id}`
        );
      }

      for (const query of updateQueries) {
        console.log(query);
        await dbModel.query(query);
      }

      return res.status(200).json({
        status: 200,
        message: "User's Accessibility Updated Successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }
}

module.exports = new Controller();

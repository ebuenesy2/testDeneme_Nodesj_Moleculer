'use strict';
const dayjs = require('dayjs'); //! Zaman
const fs = require("fs"); //! Dosya
const sign = require('jwt-encode'); //! Token
const jwt_decode = require('jwt-decode'); //! Token
const db = require('../public/DB/user.json'); //! Json

const nodemailer = require('nodemailer'); //! Mail




module.exports = {
	name: "user",

	actions: {
		
		async info(ctx) {
		
			//! Return Api
			ctx.params.title = "user.service -> Info"
			ctx.params.table = "user.json"
			ctx.params.time = dayjs().toDate()
			ctx.params.note = ""
			ctx.params.APi_URL = process.env.APi_URL

			return ctx.params

		},
		async post(ctx) {

			//! Return Api
			ctx.params.createdAt = dayjs().toDate();
			delete ctx.params.createdAt;

			return ctx.params
		},
		async html(ctx) {
		
			ctx.meta.$responseType = "text/html";
			return Buffer.from(`
                    <html>
                    <body>
                        <h1>Hello API ebu enes!</h1>
                        <img src="/api/file.image" />
                    </body>
                    </html>
            `);
			
		}
	}
}



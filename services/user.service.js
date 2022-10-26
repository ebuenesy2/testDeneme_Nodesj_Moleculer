'use strict';
const dayjs = require('dayjs'); //! Zaman
const fs = require("fs"); //! Dosya
const sign = require('jwt-encode'); //! Token
const jwt_decode = require('jwt-decode'); //! Token
const db = require('../public/DB/user.json'); //! Json

const nodemailer = require('nodemailer'); //! Mail

/************* Mail *********** */
let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
	port: 587,
    auth: {
        user: "ebuenesdeneme@hotmail.com",
        pass: "2622147enesDeneme"
    }
});

transporter.verify(function (error, success) {

  if (error) { console.log("Baglantı Hatası:",error); }
  else { console.log('Bağlantı başarıyla sağlandı:',success); }

});
/************* Mail Son *********** */



module.exports = {
	name: "user",

	actions: {
		
		async forgotPassword(ctx) {
			let user = db.find(u => u.email == ctx.params.email);

			console.log("userForget burda");
			
	        try {
				
				if (user) {
					let newPassword = "deneme123";		
					
						let mailOptions = {
							from: 'ebuenesdeneme@yandex.com',
							to: ctx.params.email,
							subject: 'Şifre Yenileme',
							text: 'Merhaba ' + 'İyi Günler Dileriz.',
						};

						transporter.sendMail(mailOptions, async (error) => {
							if (error) {
								throw ({ code: 404, message: "Şifre sıfırlanırken bir hata oluştu." })
							} else {
								// mail gönderim sonrasında işlem varsa burda yap
							}
						});

						ctx.params.status = "success"
						ctx.params.message = "mesaj gönderildi"

						return ctx.params
						
				}
				else
					throw ({ code: 404, message: "Kullanıcı Bulunamadı" })

			} catch (error) {
				
				ctx.params.status = "error"
				ctx.params.error = error
				
				return ctx.params

			}
		}
	}
}



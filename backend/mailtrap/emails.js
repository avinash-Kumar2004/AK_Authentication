import {PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE,VERIFICATION_EMAIL_TEMPLATE,WELCOME_EMAIL_TEMPLATE} from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify Your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken,
      ),
      category: "Email Verification",
    });
    console.log("Email Send Successfully", response);
  } catch (error) {
    console.error(`Error in sending verification `, error);
    throw new Error(`Error in Sending Verifcation email: ${error}`);
  }
};

// export const sendWelcomeEmail = async (email, name) => {
//   const recipient = [{ email }];
//   try {
//     const response = await mailtrapClient.send({
//       from: sender,
//       to: recipient,
//       template_uuid: "0ac315db-8461-40ff-a2dd-dedb3057be6d",
//       template_variables: {
//         company_info_name: "AK-Technologies",
//         name: name,
//       },
//     });
//     console.log("Welcome Email Sent Successfully", response);
//   } catch (error) {
//     console.log(`Error in Sending Welcome Mail`, error);
//     throw new Error(`Error in Sending Welcome Mail: ${error.message}`);
//   }
// };

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to AK-Technologies 🎉",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
      category: "Welcome Email",
    });

    console.log("Welcome Email Sent Successfully");
  } catch (error) {
    console.error("Welcome Email Error:", error.message);
  }
};

export const sendpasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password-Reset",
    });
  } catch (error) {
    console.error("Error in Sending Password Email:", error);
    throw new error(`Error in Sending Password Email ${error}`);
  }
};
export const sendResetSuccessEmail = async(email)=>{
  const recipient = [{email}]
  try {
    const response = await mailtrapClient.send({
      from:sender,
      to:recipient,
      subject:"Password Reset Successfull",
      html:PASSWORD_RESET_SUCCESS_TEMPLATE,
      category:"Password Reset"
    })
    console.log('Password Reset Successfully',response);
  } catch (error) {
    console.log('Error in Password reset success email:',error);
    throw new error(`Error sending Password reset success email: ${error}`)
  }
}
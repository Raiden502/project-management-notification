const WelcomeUser = (action) => {
	const { user_name, name } = action;
	return {
		subject: "Welcome to TFMS",
		html: `
            <div>
            <table 
                role="presentation" 
                style="
                    width: 100%; 
                    border-collapse: collapse; 
                    border: 0px; 
                    border-spacing: 0px;
                    font-family: Arial, Helvetica, sans-serif; 
                    background-color: rgb(0, 0, 0);"
            >
                <tbody>
                    <tr>
                        <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                            <table
                                role="presentation"
                                style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                                <tbody>
                                    <tr>
                                        <td style="padding: 40px 0px 0px;">
                                            <div style="text-align: left;">
                                                <div style="padding-bottom: 20px;"><img src="https://i.ibb.co/Qbnj4mz/logo.png"
                                                        alt="Company" style="width: 80px;">
                                                </div>
                                            </div>
                                            <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                                                <div style="color: rgb(43, 21, 203); text-align: left;">
                                                    <h1 style="margin: 1rem 0">Hi ${user_name},</h1>
                                                    <p style="padding-bottom: 16px">Welcome to TFMS a new organization is created by you. please use the admin credintials to login in ${name}</p>
                                                    <p style="padding-bottom: 16px">Thanks,<br>The Priya team</p>
                                                </div>
                                            </div>
                                            <div style="padding-top: 20px; color: rgb(255, 250, 250); text-align: center;">
                                                <p style="padding-bottom: 16px">Made with TFMS</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>    
        `,
	};
};

export { WelcomeUser };

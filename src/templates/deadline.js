const DeadLineTemplate = (action) => {
	const { projectname, user, task, time, taskstatus } = action;
	return {
		subject: "TFMS Dead line",
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
                                                    <h1 style="margin: 1rem 0">Time Line Update</h1>
                                                    <p style="padding-bottom: 16px"><strong style="font-size: 130%">${projectname}</strong>
                                                    </p>
                                                    <p style="padding-bottom: 16px">${user} your dead line is nearby</p>
                                                    <p style="padding-bottom: 16px">${task} still pending need to be completed by ${time}</p>
                                                    <p style="padding-bottom: 16px">Current status: ${taskstatus}</p>
                                                    <p style="padding-bottom: 16px">Thanks,<br>The Priya team</p>
                                                </div>
                                            </div>
                                            <div style="padding-top: 20px; color: rgb(255, 250, 250); text-align: center;">
                                                <p style="padding-bottom: 16px">Made with ♥ in Paris</p>
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

export { DeadLineTemplate };

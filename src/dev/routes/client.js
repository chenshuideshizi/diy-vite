const { readFileSync } = require('fs');
const { join } = require('path')

import { transformCode } from '../transform';

module.exports = (req, res) => {
	res.set('Content-Type', 'application/javascript');
	res.send(
		// 这里返回的才是真正的内置的客户端代码
		transformCode({
			code: readFileSync(join(__dirname, '..','client.js'), 'utf-8')
		}).code
	)
}
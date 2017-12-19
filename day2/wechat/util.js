const xml2js = require('xml2js');
const Promise = require('bluebird');

exports.parseXMLAsync = (xml) => {
    return new Promise((resole, reject) => {
        xml2js.parseString(xml, {trim: true}, (err, content) =>{
            if (err) {
                reject(err)
            } else {
                resole(content)
            }
        })
    })
};
function formatMessage(result) {
    let massage = {};

    if (typeof result === 'object') {
        const keys = Object.keys(result);

        for (let i = 0; i < keys.length; i++) {
            const item = result[keys[i]];
            const key = keys[i];

            if (!(item instanceof Array) || item.length === 0) {
                continue
            }

            if (item.length === 1) {
                const val = item[0];

                if (typeof val === 'object') {
                    massage[key] = formatMessage(val);
                } else {
                    massage[key] = (val || '').trim();
                }
            } else {
                massage[key] = [];

                for (let j = 0, k = item.length; j < k; j++) {
                    massage[key].push(formatMessage(item[j]))
                }
            }
        }
    }
    return massage;
}
exports.formatMessage = formatMessage;

exports.formatResponse = data => {
    return JSON.stringify(data);
};

exports.parse = data => {
    return JSON.parse(data);
}
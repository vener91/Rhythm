var mysql = require('mysql');

/* This makes the connection to the database */
exports.db = {
    client: mysql.createClient({
        user: 'root',
        password: 'root',
    }),
    //Important variables
    lastInsertID: null,
    //low level functions
    query: function(sql, callback){
        console.info(sql);
        //this.client.query(sql, callback);
        return this;
    },
    setLastID: function(){
            
    },
    getSingleRow: function(sql, callback){
        this.query(sql, function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            callback(results);
            console.log(results);
            console.log(fields);
            client.end();
        });
        return this;
    },
    insert: function(table, data, filter, callback) {
            
        if (typeof(data[0]) === 'undefined') {
            data = [data];
        }
        if (typeof(filter) != 'undefined') {
            field = implode(',', filter);
        } else {
            field = implode(',', array_keys(data[0]));
        }
        var values = '';
        for (row in data) {
            var value = '';
            if (typeof(filter) != 'undefined') {
                size = filter.length;
                for (var i = 0; i < size; i++) {
                    if (data[filter[i]] === null) {
                        value += "NULL,";
                    } else {
                        value += "'" + this.client.escape(data[row][filter[$i]]) + "',";
                    }
                }
                values += '(' + substr(value, 0, -1) + '),';
            } else {
                for(field in data[row]) {
                    if (row[field] === null) {
                        value += "NULL,";
                    } else {
                        value += "'" + this.client.escape(row[field]) + "',";
                    }
                }
                values += '(' + substr(value, 0, -1) + '),';
            }
        }

        this.query('INSERT INTO ' + table + ' (' + field + ') VALUES ' + substr(values, 0, -1), function(err, info) {
            callback(err, info);
            console.log(info.insertId);
        });
            
        return this;
    }
}
exports.db.client.useDatabase('rhythm');

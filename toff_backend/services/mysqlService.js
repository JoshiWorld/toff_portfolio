const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
    multipleStatements: true
});



// Create tables if they don't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS live (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    ticketLink VARCHAR(255),
    imageSource VARCHAR(255),
    archived BOOLEAN DEFAULT FALSE,
    isVideo BOOLEAN NOT NULL,
    mediaSource VARCHAR(255)
  );

  CREATE TABLE IF NOT EXISTS master (
    role VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    value INT,
    goal INT,
    color VARCHAR(255)
  );
`, (error) => {
    if (error) {
        console.error('Error creating tables:', error);
        return;
    }
    console.log('Tables created successfully');
});



/* ROLE MASTER */
function createMaster(master, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const { role, password } = master;

        // Generate a salt
        bcrypt.genSalt(10, (saltError, salt) => {
            if (saltError) {
                console.error('Error generating salt:', saltError);
                callback(saltError, null);
                return;
            }

            // Hash the password with the generated salt
            bcrypt.hash(password, salt, (hashError, hashedPassword) => {
                if (hashError) {
                    console.error('Error hashing password:', hashError);
                    callback(hashError, null);
                    return;
                }

                const query = `INSERT INTO master (role, password) VALUES (?, ?)`;
                const values = [role, hashedPassword];

                connection.query(query, values, (error, results) => {
                    connection.release(); // Release the connection back to the pool

                    if (error) {
                        console.error('Error executing query:', error);
                        callback(error, null);
                        return;
                    }

                    callback(null, results);
                });
            });
        });
    });
}

function getMaster(role, password, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const query = 'SELECT * FROM master WHERE role = ?';
        const values = [role];

        connection.query(query, values, (error, results) => {
            connection.release(); // Release the connection back to the pool

            if (error) {
                console.error('Error executing query:', error);
                callback(error, null);
                return;
            }

            if (results.length === 0) {
                // No master record found with the given id
                callback(null, null);
                return;
            }

            const master = results[0];
            bcrypt.compare(password, master.password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    callback(err, null);
                    return;
                }

                if (!isMatch) {
                    // Password does not match
                    callback(null, null);
                    return;
                }

                callback(null, master);
            });
        });
    });
}



/* LIVE */



function getLiveBlogs(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const query = 'SELECT * FROM live';

        connection.query(query, (error, results) => {
            connection.release(); // Release the connection back to the pool

            if (error) {
                console.error('Error executing query:', error);
                callback(error, null);
                return;
            }

            const liveblogs = [];

            results.forEach(row => {
                const liveId = row.id;

                // Check if the order already exists in the orders array
                let existingBlog = liveblogs.find(blog => blog.id === liveId);

                if (!existingBlog) {
                    existingBlog = {
                        id: row.id,
                        title: row.title,
                        description: row.description,
                        ticketLink: row.ticketLink,
                        imageSource: row.imageSource,
                        archived: row.archived,
                        isVideo: row.isVideo,
                        mediaSource: row.mediaSource,
                    };

                    liveblogs.push(existingBlog);
                }
            });

            callback(null, liveblogs);
        });
    });
}

function createLiveBlog(liveblog, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const insertQuery = `INSERT INTO live (title, description, ticketLink, imageSource, isVideo, mediaSource) 
                       VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [liveblog.title, liveblog.description, liveblog.ticketLink, liveblog.imageSource, liveblog.isVideo, liveblog.mediaSource];

        // Execute the INSERT query
        connection.query(insertQuery, values, (error, results) => {
            connection.release();

            if (error) {
                console.error('Error inserting live entry:', error);
                callback(error, null);
            } else {
                console.log('Live entry inserted successfully');
                callback(null, results);
            }
        });
    });
}

function updateLiveBlog(id, updatedData, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        // Construct the SQL query to update the live entry
        const updateQuery = `
        UPDATE live
        SET ?  -- Use an object to represent the updated data
        WHERE id = ?;`;

        // Execute the SQL query with the provided data
        connection.query(updateQuery, [updatedData, id], (error, results) => {
            connection.release();

            if (error) {
                console.error('Error updating live entry:', error);
                callback(error, null);
            } else {
                console.log('Live entry updated successfully');
                callback(null, results);
            }
        });
    });
}

function deleteLiveBlog(id, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        // Construct the SQL query to delete the live entry
        const deleteQuery = `
        DELETE FROM live
        WHERE id = ?;`;

        // Execute the SQL query with the provided ID
        connection.query(deleteQuery, [id], (error, results) => {
            connection.release();

            if (error) {
                console.error('Error deleting live entry:', error);
                callback(error, null);
            } else {
                console.log('Live entry deleted successfully');
                callback(null, results);
            }
        });
    });
}



/* STATS */


function getStats(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const query = 'SELECT * FROM stats';

        connection.query(query, (error, results) => {
            connection.release(); // Release the connection back to the pool

            if (error) {
                console.error('Error executing query:', error);
                callback(error, null);
                return;
            }

            const stats = [];

            results.forEach(row => {
                const statsId = row.id;

                // Check if the order already exists in the orders array
                let existingStat = stats.find(stat => stat.id === statsId);

                if (!existingStat) {
                    existingStat = {
                        id: row.id,
                        title: row.title,
                        value: row.value,
                        goal: row.goal,
                        color: row.color,
                    };

                    stats.push(existingStat);
                }
            });

            callback(null, stats);
        });
    });
}

function createStats(stat, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const insertQuery = `INSERT INTO stats (title, value, goal, color) 
                       VALUES (?, ?, ?, ?)`;
        const values = [stat.title, stat.value, stat.goal, stat.color];

        // Execute the INSERT query
        connection.query(insertQuery, values, (error, results) => {
            connection.release();

            if (error) {
                console.error('Error inserting stats entry:', error);
                callback(error, null);
            } else {
                console.log('Stats entry inserted successfully');
                callback(null, results);
            }
        });
    });
}

function updateStats(id, updatedData, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        // Construct the SQL query to update the stats entry
        const updateQuery = `
        UPDATE stats
        SET ?  -- Use an object to represent the updated data
        WHERE id = ?;`;

        // Execute the SQL query with the provided data
        connection.query(updateQuery, [updatedData, id], (error, results) => {
            connection.release();

            if (error) {
                console.error('Error updating stats entry:', error);
                callback(error, null);
            } else {
                console.log('Stats entry updated successfully');
                callback(null, results);
            }
        });
    });
}

function deleteStats(id, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        // Construct the SQL query to delete the live entry
        const deleteQuery = `
        DELETE FROM stats
        WHERE id = ?;`;

        // Execute the SQL query with the provided ID
        connection.query(deleteQuery, [id], (error, results) => {
            connection.release();

            if (error) {
                console.error('Error deleting stats entry:', error);
                callback(error, null);
            } else {
                console.log('Stats entry deleted successfully');
                callback(null, results);
            }
        });
    });
}


/* EXPORTS */

module.exports = {
    // MASTER
    createMaster,
    getMaster,

    // LIVE
    getLiveBlogs,
    createLiveBlog,
    updateLiveBlog,
    deleteLiveBlog,

    // STATS
    getStats,
    createStats,
    updateStats,
    deleteStats
};

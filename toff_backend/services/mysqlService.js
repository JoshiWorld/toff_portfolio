const mysql = require('mysql2');
const { encrypt, decrypt } = require('./cryptoService');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
    multipleStatements: true
});



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
  
  CREATE TABLE IF NOT EXISTS email (
    email_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS active_email (
    active_email_id INT PRIMARY KEY AUTO_INCREMENT,
    email_id INT,
    FOREIGN KEY (email_id) REFERENCES email (email_id),
    UNIQUE (email_id)
  );
  
  CREATE TABLE IF NOT EXISTS deals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    link VARCHAR(255) NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS deal_song (
    id INT PRIMARY KEY AUTO_INCREMENT,
    song_id VARCHAR(255) NOT NULL
  );
  
  INSERT IGNORE INTO deal_song (song_id) VALUES ('https://open.spotify.com/intl-de/track/4joXMyRKlxq7nY6b5NipY5?si=ad2423f592704d76');
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

function getLiveBlogById(id, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const query = 'SELECT * FROM live WHERE id = ' + id;

        connection.query(query, (error, result) => {
            connection.release(); // Release the connection back to the pool

            if (error) {
                console.error('Error executing query:', error);
                callback(error, null);
                return;
            }

            let liveblog;

            if(result) {
                liveblog = {
                    id: result.id,
                    title: result.title,
                    description: result.description,
                    ticketLink: result.ticketLink,
                    imageSource: result.imageSource,
                    archived: result.archived,
                    isVideo: result.isVideo,
                    mediaSource: result.mediaSource,
                };

                callback(null, liveblog);
            }
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



/* MAILER */



function getActiveEmail(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const query = 'SELECT email, password FROM email WHERE email_id IN (SELECT email_id FROM active_email)';

        connection.query(query, (error, result) => {
            connection.release();

            if (error) {
                console.error('Error executing query:', error);
                callback(error, null);
                return;
            }

            if (result.length > 0) {
                const activeEmail = {
                    email: result[0].email,
                    password: decrypt(result[0].password),
                };

                callback(null, activeEmail);
            } else {
                callback(null, null);
            }
        });
    });
}

function createEmail(emailUser, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            callback(err, null);
            return;
        }

        const insertQuery = 'INSERT INTO email (email, password) VALUES (?, ?)';

        const values = [emailUser.email, encrypt(emailUser.password)];

        connection.query(insertQuery, values, (error, results) => {
            if (error) {
                connection.release();
                console.error('Error inserting email entry:', error);
                callback(error, null);
                return;
            }

            const checkActiveEmailQuery = 'SELECT COUNT(*) AS activeEmailCount FROM active_email';

            connection.query(checkActiveEmailQuery, (checkError, checkResults) => {
                if (checkError) {
                    connection.release();
                    console.error('Error checking active_email table:', checkError);
                    callback(checkError, null);
                    return;
                }

                const activeEmailCount = checkResults[0].activeEmailCount;

                if (activeEmailCount === 0) {
                    const makeActiveQuery = 'INSERT INTO active_email (email_id) VALUES (?)';

                    connection.query(makeActiveQuery, [results.insertId], (makeActiveError) => {
                        connection.release();

                        if (makeActiveError) {
                            console.error('Error making the email active:', makeActiveError);
                            callback(makeActiveError, null);
                        } else {
                            console.log('Email entry inserted and set as active successfully');
                            callback(null, results);
                        }
                    });
                } else {
                    connection.release();
                    console.log('Email entry inserted successfully, but not set as active');
                    callback(null, results);
                }
            });
        });
    });
}

function updateEmail(id, updatedData, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            callback(err, null);
            return;
        }

        const getActiveEmailQuery = 'SELECT email_id FROM active_email';

        connection.query(getActiveEmailQuery, (error, result) => {
            if (error) {
                connection.release();
                console.error('Error fetching active email:', error);
                callback(error, null);
                return;
            }

            if (result && result[0]) {
                const isActive = result[0].email_id === parseInt(id);

                if (updatedData.isActive && !isActive) {
                    const updateActiveQuery = 'UPDATE active_email SET email_id = ? WHERE email_id = ?';
                    connection.query(updateActiveQuery, [id, id], (error) => {
                        if (error) {
                            connection.release();
                            console.error('Error updating active email:', error);
                            callback(error, null);
                        } else {
                            console.log('Email is now marked as active');
                            updateEmailData(id, updatedData, callback, connection);
                        }
                    });
                } else if (!updatedData.isActive && isActive) {
                    const deleteActiveEmailQuery = 'DELETE FROM active_email WHERE email_id = ?';
                    connection.query(deleteActiveEmailQuery, [id], (error) => {
                        if (error) {
                            connection.release();
                            console.error('Error deleting active email:', error);
                            callback(error, null);
                        } else {
                            console.log('Email is no longer active');
                            updateEmailData(id, updatedData, callback, connection);
                        }
                    });
                } else {
                    updateEmailData(id, updatedData, callback, connection);
                }
            } else if (updatedData.isActive) {
                const insertActiveEmailQuery = 'INSERT INTO active_email (email_id) VALUES (?)';
                connection.query(insertActiveEmailQuery, [id], (error) => {
                    if (error) {
                        connection.release();
                        console.error('Error adding new active email:', error);
                        callback(error, null);
                    } else {
                        console.log('Email is marked as active');
                        updateEmailData(id, updatedData, callback, connection);
                    }
                });
            } else {
                updateEmailData(id, updatedData, callback, connection);
            }

        });
    });
}

function updateEmailData(id, updatedEmailData, callback, connection) {
    const updateQuery = 'UPDATE email SET ? WHERE email_id = ?';
    delete updatedEmailData.isActive;
    connection.query(updateQuery, [updatedEmailData, id], (error, results) => {
        connection.release();
        if (error) {
            console.error('Error updating email entry:', error);
            callback(error, null);
        } else {
            console.log('Email entry updated successfully');
            callback(null, results);
        }
    });
}

function deleteEmail(id, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            callback(err, null);
            return;
        }

        const getEmailQuery = 'SELECT * FROM email WHERE id = ?';
        connection.query(getEmailQuery, [id], (fetchError, emailResult) => {
            if (fetchError) {
                connection.release();
                console.error('Error fetching email:', fetchError);
                callback(fetchError, null);
                return;
            }

            if (emailResult.length === 0) {
                connection.release();
                callback('Email not found', null);
                return;
            }

            const emailToDelete = emailResult[0];

            const getActiveEmailQuery = 'SELECT email FROM active_email';
            connection.query(getActiveEmailQuery, (activeEmailError, activeEmailResult) => {
                if (activeEmailError) {
                    connection.release();
                    console.error('Error fetching active email:', activeEmailError);
                    callback(activeEmailError, null);
                    return;
                }

                const activeEmail = (activeEmailResult[0] && activeEmailResult[0].email) || '';

                if (emailToDelete.email === activeEmail) {
                    const deleteActiveEmailQuery = 'DELETE FROM active_email';
                    connection.query(deleteActiveEmailQuery, (deleteActiveEmailError) => {
                        if (deleteActiveEmailError) {
                            connection.release();
                            console.error('Error deleting active email:', deleteActiveEmailError);
                            callback(deleteActiveEmailError, null);
                            return;
                        }

                        console.log('Active email deleted successfully');
                        deleteEmailFromEmailTable(connection, id, callback);
                    });
                } else {
                    deleteEmailFromEmailTable(connection, id, callback);
                }
            });
        });
    });
}

function deleteEmailFromEmailTable(connection, id, callback) {
    const deleteEmailQuery = 'DELETE FROM email WHERE id = ?';
    connection.query(deleteEmailQuery, [id], (deleteError, deleteResult) => {
        if (deleteError) {
            console.error('Error deleting email entry:', deleteError);
            connection.release();
            callback(deleteError, null);
        } else {
            console.log('Email entry deleted successfully');
            connection.release();
            callback(null, deleteResult);
        }
    });
}

function getEmails(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const getEmailQuery = 'SELECT * FROM email';
        const getActiveEmailQuery = 'SELECT email_id FROM active_email';

        connection.query(getEmailQuery, (error, results) => {
            if (error) {
                connection.release();
                console.error('Error executing query:', error);
                callback(error, null);
                return;
            }

            const emails = [];

            connection.query(getActiveEmailQuery, (activeEmailError, activeEmailResults) => {
                if (activeEmailError) {
                    connection.release();
                    console.error('Error fetching active email:', activeEmailError);
                    callback(activeEmailError, null);
                    return;
                }

                const activeEmail = activeEmailResults[0]?.email_id || '';

                results.forEach(row => {
                    let existingEmail = {
                        id: row.email_id,
                        email: row.email,
                        isActive: row.email_id === activeEmail,
                    };

                    emails.push(existingEmail);
                });

                connection.release();
                callback(null, emails);
            });
        });
    });
}



/* DEALS */



function getDeals(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const query = 'SELECT * FROM deals';

        connection.query(query, (error, results) => {
            connection.release();

            if (error) {
                console.error('Error executing query:', error);
                callback(error, null);
                return;
            }

            const deals = [];

            results.forEach(row => {
                const dealId = row.id;

                let existingDeal = deals.find(deal => deal.id === dealId);

                if (!existingDeal) {
                    existingDeal = {
                        id: row.id,
                        title: row.title,
                        description: row.description,
                        price: row.price,
                        link: row.link,
                    };

                    deals.push(existingDeal);
                }
            });

            callback(null, deals);
        });
    });
}

function createDeal(deal, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const insertQuery = `INSERT INTO deals (title, description, price, link) 
                       VALUES (?, ?, ?, ?)`;
        const values = [deal.title, deal.description, deal.price, deal.link];

        // Execute the INSERT query
        connection.query(insertQuery, values, (error, results) => {
            connection.release();

            if (error) {
                console.error('Error inserting deals entry:', error);
                callback(error, null);
            } else {
                console.log('Deals entry inserted successfully');
                callback(null, results);
            }
        });
    });
}

function updateDeal(id, updatedData, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const updateQuery = `UPDATE deals SET ? WHERE id = ?;`;

        connection.query(updateQuery, [updatedData, id], (error, results) => {
            connection.release();

            if (error) {
                console.error('Error updating deals entry:', error);
                callback(error, null);
            } else {
                console.log('Deals entry updated successfully');
                callback(null, results);
            }
        });
    });
}

function deleteDeal(id, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const deleteQuery = `DELETE FROM deals WHERE id = ?;`;

        connection.query(deleteQuery, [id], (error, results) => {
            connection.release();

            if (error) {
                console.error('Error deleting deals entry:', error);
                callback(error, null);
            } else {
                console.log('Deals entry deleted successfully');
                callback(null, results);
            }
        });
    });
}

function createDealSong(dealSong, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const insertQuery = `INSERT INTO deal_song (song_id) VALUES (?)`;
        const values = [dealSong.song_id];

        connection.query(insertQuery, values, (error, results) => {
            connection.release();

            if (error) {
                console.error('Error inserting deals_song entry:', error);
                callback(error, null);
            } else {
                console.log('Deals_song entry inserted successfully');
                callback(null, results);
            }
        });
    });
}

function updateDealSong(id, updatedData, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const updateQuery = `UPDATE deal_song SET ? WHERE id = ?;`;

        connection.query(updateQuery, [updatedData, id], (error, results) => {
            connection.release();

            if (error) {
                console.error('Error updating deals_song entry:', error);
                callback(error, null);
            } else {
                console.log('Deals_song entry updated successfully');
                callback(null, results);
            }
        });
    });
}

function getDealSong(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err);
            callback(err, null);
            return;
        }

        const query = 'SELECT * FROM deal_song';

        connection.query(query, (error, results) => {
            connection.release();

            if (error) {
                console.error('Error executing query:', error);
                callback(error, null);
                return;
            }

            const deals = [];

            results.forEach(row => {
                const dealId = row.id;

                let existingDeal = deals.find(deal => deal.id === dealId);

                if (!existingDeal) {
                    existingDeal = {
                        id: row.id,
                        song_id: row.song_id
                    };

                    deals.push(existingDeal);
                }
            });

            callback(null, deals);
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
    getLiveBlogById,

    // STATS
    getStats,
    createStats,
    updateStats,
    deleteStats,

    // MAILER
    getActiveEmail,
    createEmail,
    updateEmail,
    deleteEmail,
    getEmails,

    // DEALS
    getDeals,
    createDeal,
    updateDeal,
    deleteDeal,
    createDealSong,
    updateDealSong,
    getDealSong
};

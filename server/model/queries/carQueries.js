const createCar = `INSERT INTO cars(state, price, manufacturer, model,
   bodyType, transmission, milage, year, exteriorImg, interiorImg, 
   engineImg, ownerEmail, owner)
VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`;

export {
  createCar,
};

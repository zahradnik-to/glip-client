import axios from 'axios';

const getServices = async () => {
  const services = await axios.get("/role/get?type=staffRole");
  return services.data
}

export { getServices }
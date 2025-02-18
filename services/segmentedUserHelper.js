import Segment from '../models/Segment.js';
import {customers} from '../data/customerData.js'
 export const fetchSegmentedUsers = async(segmentId)=>{
  try {
    const segment = await Segment.find({ segment: segmentId });
    // Now we find segmented user

    const users = customers;
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
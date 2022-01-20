import { Router } from "express";

// entity imports
import { Customer } from "../entities/Users";

const router = Router();

/**
 * @description
 * Express route for redeeming promotion coupons
 * 
 * Take the coupon code and uid from the
 * request parameters and redeem the coupon
 * for the user if it is valid.
 * 
 * [QR] ---->  /promotion/use/<code>/<uid> --> X
 * 
 * @params code: ID of the promotion
 * @params uid: the user's id
 * @returns a JSON string relating to success or error
 */
router.get('/use/:code/:uid', async (req, res) => {
    const { code, uid }: any = req.params;

    // check if params were passed
    if (!code || !uid) {
        return res.status(400).json({
            message: 'Invalid parameters'
        });
    }

    const customer = await Customer.findById(uid);
    if (!customer) {
        return res.status(404).json({
            message: 'Customer not found'
        });
    }
    
    // filter through the customers promotions and 
    // attempt a match on the code
    const coupon = customer.redeemedPromotions.find(
        promotion => promotion._id == code
    );

    // if the coupon is not found, return an error
    if (!coupon) {
        return res.status(404).json({
            message: 'Coupon not found'
        });
    }

    // remove the coupon from the customers list of redeemed promotions
    let updatedPromotions = customer.redeemedPromotions.filter(
        promotion => promotion._id != code
    );

    // update the customers promotions
    await Customer.findByIdAndUpdate(uid, { 
        $set: { redeemedPromotions: updatedPromotions }
    });

    return res.status(200).json({
        message: 'Coupon redeemed successfully'
    });
});

export default router;
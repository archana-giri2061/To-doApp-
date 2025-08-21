import { User } from "./entity/user";
declare global{
    namespace express{
        interface request{
           Iuser?:User
        }
    }
}
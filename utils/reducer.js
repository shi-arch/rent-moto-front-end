import moment from "moment"

const initialState = {
  counter: 0,
  showLoginModel: false,
  otpModel: false,
  loading: false,
  error: "",
  mobile: "",
  citiesModal: false,
  startDate: "",
  startTime: "",
  selectedVehicle: "",
  filterData: "",
  //endTime: { hours: 10, minutes: 0 },
  endTime: "",
  vehicleData: "",
  citiesData: "",
  endDate: "",
  selectedLocality: "",
  disabledKeys: "",
  soldOut: false,
  showSignUpModel: false,
  loginData: "",
  isLoggedIn: false,
  paymentMethod: "",
  userDetails: { userType: "USER" },
  showPayModel: false,
  triggerApi: false,
  filterString: {},
  defaultBrand: "Please choose brand",
  defaultPrice: "Please sort type",
  vehicleName: "",
  selectedCity: "",
  selectedKeys: "",
  defaultPickupLocation: "Please select the nearby location"
};

const RootReducer = (state = initialState, action) => {
  switch (action.type) {    
    case 'PAYMENTMETHOD':
      return { ...state, paymentMethod: action.payload };
      case 'SELECTEDKEYS':
      return { ...state, selectedKeys: action.payload };
      case 'SHOWSIGNUPMODAL':
      return { ...state, showSignUpModel: action.payload };
    case 'DEFAULTBRAND':
      return { ...state, defaultBrand: action.payload };
    case 'DEFAULTPRICE':
      return { ...state, defaultPrice: action.payload };
    case 'DEFAULTPICKUPLOCATION':
      return { ...state, defaultPickupLocation: action.payload };
    case 'TRIGGERAPI':
      return { ...state, triggerApi: action.payload };
    case 'DISABLEDKEYS':
      return { ...state, disabledKeys: action.payload };
    case 'SHOWLOGINMODEL':
      return { ...state, showLoginModel: action.payload };
    case 'USERDETAILS':
      return { ...state, userDetails: action.payload };
    case 'SOLDOUT':
      return { ...state, soldOut: action.payload };
    case 'OTPMODEL':
      return { ...state, otpModel: action.payload };
    case 'ERROR':
      return { ...state, error: action.payload };
    case 'MOBILE':
      return { ...state, mobile: action.payload };
    case 'SELECTEDCITY':
      return { ...state, selectedCity: action.payload };
    case 'CITIESTMODAL':
      return { ...state, citiesModal: action.payload };
    case 'STARTDATE':
      return { ...state, startDate: action.payload };
    case 'ENDTIME':
      return { ...state, endTime: action.payload };
    case 'STARTTIME':
      return { ...state, startTime: action.payload };
      case 'SHOWPAYMODEL':
      return { ...state, showPayModel: action.payload };
    case 'ENDDATE':      
      return { ...state, endDate: action.payload };
    case 'VEHICLADATA':
      return { ...state, vehicleData: action.payload };
    case 'SELECTEDVEHICLE':
      return { ...state, selectedVehicle: action.payload };
    case 'CITIESDATA':
      return { ...state, citiesData: action.payload };
    case 'FILTERSTRING':
      return { ...state, filterString: action.payload };
    case 'SELECTEDLOCALITY':
      return { ...state, selectedLocality: action.payload };
    case 'FILTERDATA':
      return { ...state, filterData: action.payload };
    case 'LOADING':
      return { ...state, loading: action.payload };
    case 'VEHICLENAME':
      return { ...state, vehicleName: action.payload };
    case 'LOGINDATA':
      return { ...state, loginData: action.payload };
    case 'ISLOGGEDIN':
      return { ...state, isLoggedIn: action.payload };

    default:
      return state;
  }
};

export default RootReducer
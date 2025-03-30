import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo: string | null;
  active: boolean;
  language: string;
  iso_code: string;
  profile: string[];
  otp?: boolean | false;
}

export interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateLang: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.language = action.payload;
      }
    },
  },
});

export const { setUser, setLoading, setError, updateLang } = userSlice.actions;
export default userSlice.reducer;

export type LoginContextType = {
    login:boolean;
    loading:boolean;
    setLogin:(login: boolean) => void
    setLoading:(loading: boolean) => void
  };
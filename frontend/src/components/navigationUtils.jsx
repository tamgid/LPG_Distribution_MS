import { useNavigate } from 'react-router-dom';

const useConditionalNavigate = (condition, path) => {
  const navigate = useNavigate();

  if (condition) {
    navigate(path);
  }
};

export default useConditionalNavigate;
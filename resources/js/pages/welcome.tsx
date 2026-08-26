import useService from '@/hooks/use-service';
import { useCatalogsStore } from '@/store/catalogs-store';
import { AffectationType, Category, Unit, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;
  const {
    categories,
    setCategories,
    units,
    setUnits,
    affectationTypes,
    setAffectationTypes,
  } = useCatalogsStore(state => state);

  const {getCategories, data: categoriesData} = useService<Category[]>()
  const {getUnits, data: unitsData} = useService<Unit[]>()
  const {getAffectationTypes, data: affectationTypesData} = useService<AffectationType[]>()
  
  useEffect(() => {
    if (!categories) getCategories();
    if (!units) getUnits();
    if (!affectationTypes) getAffectationTypes();
  }, []);

  useEffect(() => {
    if (!categoriesData) return;
    setCategories(categoriesData)
  }, [categoriesData]);
  useEffect(() => {
    if (!unitsData) return;
    setUnits(unitsData)
  }, [unitsData]);
  useEffect(() => {
    if (!affectationTypesData) return;
    setAffectationTypes(affectationTypesData)
  }, [affectationTypesData]);

  return (
    <>
      
    </>
  );
}

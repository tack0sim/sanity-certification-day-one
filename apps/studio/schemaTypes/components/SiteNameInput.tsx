import { type ArrayOfPrimitivesInputProps, set, unset, type ArraySchemaType } from 'sanity';
import { useCallback } from 'react';
import { Box, Checkbox, Flex, Text } from '@sanity/ui';
import { SITES, type Site, type SiteName } from '../../lib/SITES';

export const SiteNameInput = (
  props: ArrayOfPrimitivesInputProps<string | boolean | number, ArraySchemaType<unknown>>,
) => {
  const { value, onChange } = props;

  const handleChange = useCallback(
    (siteName: SiteName) => {
      const current = value ?? [];
      if (current.includes(siteName)) {
        const newValues = current.filter((name) => name !== siteName);

        if (newValues.length === 0) {
          onChange(unset());
        } else {
          onChange(set(newValues));
        }
      } else {
        onChange(set([...current, siteName]));
      }
    },
    [onChange, value],
  );

  return (
    <Box>
      {SITES.map((site: Site) => {
        const isChecked = (value ?? []).some((v) => v === site.name);

        return (
          <Flex key={site.name} as="label" align="center" style={{ border: site ? '1px solid' : '' }}>
            <Flex padding={3}>
              <Checkbox checked={isChecked} onChange={() => handleChange(site.name)} />
            </Flex>
            <Text>{site.title}</Text>
          </Flex>
        );
      })}
    </Box>
  );
};

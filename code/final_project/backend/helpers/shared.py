

def get_list_from_comma_separated_string(value: str) -> list:
    if not value or not isinstance(value, str):
        return []
    return [item.strip() for item in value.split(',') if item.strip()]
